import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

// Middleware helper to verify token roles dynamically
const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header required.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: decoded.id, role: decoded.role, name: decoded.name };
    next();
  } catch (err) {
    // Fallback/backwards compatibility with custom headers
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    if (userId && userRole) {
      req.user = { id: userId, role: userRole };
      return next();
    }
    return res.status(401).json({ error: 'Invalid or expired authorization token.' });
  }
};

// 1. Submit Certificate Request (Resident)
router.post('/apply', authUser, async (req, res) => {
  const { certificateType, purpose, requestDate, supportingDocs } = req.body;
  const residentNic = req.user.id;

  try {
    if (!certificateType || !purpose || !requestDate) {
      return res.status(400).json({ error: 'Certificate type, purpose, and date are required.' });
    }

    const requestId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Get GN officer assigned to BORELLA division (or division related to resident's household)
    const [gnRows] = await pool.query(
      `SELECT gn.gn_id FROM grama_niladhari gn
       JOIN resident r ON r.r_nic = ?
       JOIN household h ON h.household_number = r.household_number
       WHERE gn.division_id = h.division_id`,
      [residentNic]
    );

    const gnId = gnRows.length > 0 ? gnRows[0].gn_id : null;

    // Create Certificate Request
    await pool.query(
      `INSERT INTO certificate_request (request_id, certificate_type, purpose, request_date, status, resident_nic, gn_id) 
       VALUES (?, ?, ?, ?, 'PENDING', ?, ?)`,
      [requestId, certificateType, purpose, requestDate, residentNic, gnId]
    );

    // Insert attached documents if provided
    if (supportingDocs && Array.isArray(supportingDocs)) {
      for (const doc of supportingDocs) {
        const docId = `DOC-${uuidv4().substring(0, 8).toUpperCase()}`;
        await pool.query(
          `INSERT INTO document (document_id, document_type, file_path, upload_date, request_id) 
           VALUES (?, ?, ?, NOW(), ?)`,
          [docId, doc.type || 'UTILITY_BILL', doc.path || 'uploads/proof.pdf', requestId]
        );
      }
    }

    res.status(201).json({ success: true, message: 'Certificate request submitted successfully.', requestId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Fetch Requests for Resident
router.get('/resident', authUser, async (req, res) => {
  const residentNic = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT cr.*, gn.name AS officer_name FROM certificate_request cr
       LEFT JOIN grama_niladhari gn ON gn.gn_id = cr.gn_id
       WHERE cr.resident_nic = ?
       ORDER BY cr.request_date DESC`,
      [residentNic]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Fetch Requests for Officer Audit Panel
router.get('/officer', authUser, async (req, res) => {
  const officerId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT cr.*, r.name AS resident_name, r.email AS resident_email, h.address AS resident_address
       FROM certificate_request cr
       JOIN resident r ON r.r_nic = cr.resident_nic
       JOIN household h ON h.household_number = r.household_number
       WHERE cr.gn_id = ?
       ORDER BY cr.request_date DESC`,
      [officerId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Audit Actions (Approve / Reject) (GN Officer)
router.put('/:id/action', authUser, async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body; // status: 'APPROVED', 'REJECTED'

  try {
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Valid action status (APPROVED/REJECTED) is required.' });
    }

    const [rows] = await pool.query('SELECT * FROM certificate_request WHERE request_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Certificate request not found.' });
    }

    await pool.query(
      `UPDATE certificate_request 
       SET status = ?, rejection_reason = ?, action_date = NOW() 
       WHERE request_id = ?`,
      [status, rejectionReason || null, id]
    );

    res.status(200).json({ success: true, message: `Certificate request has been successfully ${status.toLowerCase()}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
