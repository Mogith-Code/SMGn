import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

const router = express.Router();

const authUser = (req, res, next) => {
  req.user = { id: req.headers['x-user-id'] || 'GN-BORELLA', role: req.headers['x-user-role'] || 'OFFICER' };
  next();
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

export default router;
