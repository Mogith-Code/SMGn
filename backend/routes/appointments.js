import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

const router = express.Router();

const authUser = (req, res, next) => {
  req.user = { id: req.headers['x-user-id'] || '789456123V', role: req.headers['x-user-role'] || 'RESIDENT' };
  next();
};

// 1. Book Appointment (Resident)
router.post('/book', authUser, async (req, res) => {
  const { date, time, purpose } = req.body;
  const residentNic = req.user.id;

  try {
    if (!date || !time || !purpose) {
      return res.status(400).json({ error: 'Date, time and purpose are required fields.' });
    }

    const appointmentId = `APT-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Get GN officer
    const [gnRows] = await pool.query(
      `SELECT gn.gn_id FROM grama_niladhari gn
       JOIN resident r ON r.r_nic = ?
       JOIN household h ON h.household_number = r.household_number
       WHERE gn.division_id = h.division_id`,
      [residentNic]
    );
    const gnId = gnRows.length > 0 ? gnRows[0].gn_id : null;

    if (!gnId) {
      return res.status(400).json({ error: 'No GN Officer assigned to your division currently.' });
    }

    // Insert Appointment
    await pool.query(
      `INSERT INTO appointment (appointment_id, date, time, purpose, status, resident_nic, gn_id) 
       VALUES (?, ?, ?, ?, 'PENDING', ?, ?)`,
      [appointmentId, date, time, purpose, residentNic, gnId]
    );

    res.status(201).json({ success: true, message: 'Appointment booked successfully.', appointmentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Fetch Appointments (Resident View)
router.get('/resident', authUser, async (req, res) => {
  const residentNic = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT appt.*, gn.name AS officer_name FROM appointment appt
       LEFT JOIN grama_niladhari gn ON gn.gn_id = appt.gn_id
       WHERE appt.resident_nic = ?
       ORDER BY appt.date DESC, appt.time DESC`,
      [residentNic]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Fetch Appointments (Officer Queue list)
router.get('/officer', authUser, async (req, res) => {
  const officerId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT appt.*, r.name AS resident_name, r.mobile_no AS resident_mobile
       FROM appointment appt
       JOIN resident r ON r.r_nic = appt.resident_nic
       WHERE appt.gn_id = ?
       ORDER BY appt.date ASC, appt.time ASC`,
      [officerId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update Appointment Status (GN Officer)
router.put('/:id/status', authUser, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status: 'CONFIRMED', 'DECLINED'

  try {
    if (!status || !['CONFIRMED', 'DECLINED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status (CONFIRMED/DECLINED) is required.' });
    }

    const [rows] = await pool.query('SELECT * FROM appointment WHERE appointment_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    await pool.query(
      `UPDATE appointment 
       SET status = ? 
       WHERE appointment_id = ?`,
      [status, id]
    );

    res.status(200).json({ success: true, message: `Appointment successfully ${status.toLowerCase()}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
