import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

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

// 1. Create Announcement (GN Officer)
router.post('/publish', authUser, async (req, res) => {
  const { title, description, type } = req.body;
  const officerId = req.user.id;

  try {
    if (!title || !description || !type) {
      return res.status(400).json({ error: 'Title, description and type are required.' });
    }

    const announcementId = `ANN-${uuidv4().substring(0, 8).toUpperCase()}`;

    await pool.query(
      `INSERT INTO announcement (announcement_id, title, date, description, type, gn_id) 
       VALUES (?, ?, CURDATE(), ?, ?, ?)`,
      [announcementId, title, description, type, officerId]
    );

    res.status(201).json({ success: true, message: 'Announcement published successfully.', announcementId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Fetch Announcements for Resident Feed
router.get('/feed', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, gn.name AS officer_name, div.name AS division_name 
       FROM announcement a
       JOIN grama_niladhari gn ON gn.gn_id = a.gn_id
       JOIN gn_division div ON div.division_id = gn.division_id
       ORDER BY a.date DESC`
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Fetch Announcements created by particular Officer
router.get('/officer', authUser, async (req, res) => {
  const officerId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM announcement 
       WHERE gn_id = ?
       ORDER BY date DESC`,
      [officerId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update Announcement (GN Officer)
router.put('/:id', authUser, async (req, res) => {
  const { id } = req.params;
  const { title, description, type } = req.body;

  try {
    await pool.query(
      `UPDATE announcement 
       SET title = ?, description = ?, type = ? 
       WHERE announcement_id = ?`,
      [title, description, type, id]
    );
    res.status(200).json({ success: true, message: 'Announcement updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Delete Announcement (GN Officer)
router.delete('/:id', authUser, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `DELETE FROM announcement WHERE announcement_id = ?`,
      [id]
    );
    res.status(200).json({ success: true, message: 'Announcement deleted permanently.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
