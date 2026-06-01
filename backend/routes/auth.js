import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

const router = express.Router();

// Helper to sign JWT
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
};

// 1. Register Resident
router.post('/register', async (req, res) => {
  const { nic, name, dob, password, gender, mobile, occupation, email, householdNumber } = req.body;

  try {
    if (!nic || !name || !dob || !password || !gender || !mobile || !email || !householdNumber) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verify if household exists
    const [hRows] = await pool.query('SELECT * FROM household WHERE household_number = ?', [householdNumber]);
    if (hRows.length === 0) {
      return res.status(400).json({ error: 'Household number does not exist. Please contact your GN division.' });
    }

    // Insert resident
    await pool.query(
      `INSERT INTO resident (r_nic, name, date_of_birth, password, gender, mobile_no, occupation, email, household_number) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nic, name, dob, hashedPassword, gender, mobile, occupation, email, householdNumber]
    );

    res.status(201).json({ success: true, message: 'Resident registered successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'NIC number or Email address is already registered.' });
    }
    res.status(500).json({ error: error.message });
  }
});

// 2. Resident Login
router.post('/login/resident', async (req, res) => {
  const { nic, password } = req.body;

  try {
    if (!nic || !password) {
      return res.status(400).json({ error: 'NIC and Password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM resident WHERE r_nic = ?', [nic]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid NIC number or password.' });
    }

    const resident = rows[0];
    const isMatch = await bcrypt.compare(password, resident.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid NIC number or password.' });
    }

    const token = generateToken({ id: resident.r_nic, role: 'RESIDENT', name: resident.name });
    res.status(200).json({ success: true, token, user: { nic: resident.r_nic, name: resident.name, email: resident.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GN Officer Login
router.post('/login/officer', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and Password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM grama_niladhari WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const officer = rows[0];
    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = generateToken({ id: officer.gn_id, role: 'OFFICER', name: officer.name });
    res.status(200).json({ success: true, token, user: { id: officer.gn_id, name: officer.name, email: officer.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Admin Login
router.post('/login/admin', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and Password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const adminUser = rows[0];
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = generateToken({ id: adminUser.admin_id, role: 'ADMIN', name: adminUser.name });
    res.status(200).json({ success: true, token, user: { id: adminUser.admin_id, name: adminUser.name, email: adminUser.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
