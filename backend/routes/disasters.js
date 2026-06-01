import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

const router = express.Router();

const authUser = (req, res, next) => {
  req.user = { id: req.headers['x-user-id'] || '789456123V', role: req.headers['x-user-role'] || 'RESIDENT' };
  next();
};

// 1. Report Disaster damage (Resident)
router.post('/report', authUser, async (req, res) => {
  const { disasterType, description, severity, location, contact, aidRequested } = req.body;
  const residentNic = req.user.id;

  try {
    if (!disasterType || !description || !location || !contact) {
      return res.status(400).json({ error: 'Disaster type, description, location, and contact are required.' });
    }

    const disasterId = `DIS-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Get GN officer
    const [gnRows] = await pool.query(
      `SELECT gn.gn_id FROM grama_niladhari gn
       JOIN resident r ON r.r_nic = ?
       JOIN household h ON h.household_number = r.household_number
       WHERE gn.division_id = h.division_id`,
      [residentNic]
    );
    const gnId = gnRows.length > 0 ? gnRows[0].gn_id : null;

    // Create Disaster report request
    await pool.query(
      `INSERT INTO disaster_request (disaster_request_id, disaster_type, request_date, description, status, severity, location, contact_number, aid_requested, resident_nic, gn_id) 
       VALUES (?, ?, CURDATE(), ?, 'PENDING', ?, ?, ?, ?, ?, ?)`,
      [disasterId, disasterType, description, severity || 'MEDIUM', location, contact, aidRequested || null, residentNic, gnId]
    );

    res.status(201).json({ success: true, message: 'Disaster reported successfully.', disasterId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Fetch Disasters (Resident view)
router.get('/resident', authUser, async (req, res) => {
  const residentNic = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM disaster_request 
       WHERE resident_nic = ?
       ORDER BY request_date DESC`,
      [residentNic]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Fetch Disasters (Officer Panel)
router.get('/officer', authUser, async (req, res) => {
  const officerId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT dr.*, r.name AS resident_name, r.mobile_no AS resident_mobile
       FROM disaster_request dr
       JOIN resident r ON r.r_nic = dr.resident_nic
       WHERE dr.gn_id = ?
       ORDER BY dr.request_date DESC`,
      [officerId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update Disaster Severity & Aid Dispatch Status (Officer / Admin)
router.put('/:id/action', authUser, async (req, res) => {
  const { id } = req.params;
  const { status, severity, officerRemarks } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM disaster_request WHERE disaster_request_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Disaster report not found.' });
    }

    await pool.query(
      `UPDATE disaster_request 
       SET status = ?, severity = ?, officer_remarks = ? 
       WHERE disaster_request_id = ?`,
      [status || 'PENDING', severity || 'MEDIUM', officerRemarks || '', id]
    );

    res.status(200).json({ success: true, message: 'Disaster report successfully updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
