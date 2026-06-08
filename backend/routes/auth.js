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
  const { nic, name, dob, password, gender, mobile, occupation, email, householdNumber, division } = req.body;

  try {
    if (!nic || !name || !dob || !password || !gender || !mobile || !email || !householdNumber) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get or create division
    const divisionName = division || 'Colombo, Borella';
    let divisionId = 'DIV-BORELLA-01';

    const [divRows] = await pool.query('SELECT division_id FROM gn_division WHERE name = ? OR name LIKE ?', [divisionName, `%${divisionName}%`]);
    if (divRows.length > 0) {
      divisionId = divRows[0].division_id;
    } else {
      divisionId = `DIV-${uuidv4().substring(0, 8).toUpperCase()}`;
      await pool.query(
        'INSERT INTO gn_division (division_id, name, district, province) VALUES (?, ?, ?, ?)',
        [divisionId, divisionName, 'Colombo', 'Western']
      );
    }

    // Verify if household exists, if not create it
    const [hRows] = await pool.query('SELECT * FROM household WHERE household_number = ?', [householdNumber]);
    if (hRows.length === 0) {
      const defaultAddress = `${householdNumber}, Temple Road, ${divisionName}`;
      await pool.query(
        'INSERT INTO household (household_number, address, division_id) VALUES (?, ?, ?)',
        [householdNumber, defaultAddress, divisionId]
      );
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

// 1.5. Register GN Officer
router.post('/register/officer', async (req, res) => {
  const { username, name, email, mobile, division, password } = req.body;

  try {
    if (!username || !name || !email || !mobile || !division || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get or create division
    const divisionName = division;
    let divisionId = '';

    const [divRows] = await pool.query('SELECT division_id FROM gn_division WHERE name = ? OR name LIKE ?', [divisionName, `%${divisionName}%`]);
    if (divRows.length > 0) {
      divisionId = divRows[0].division_id;
      
      // Check if division already has an officer
      const [officerRows] = await pool.query('SELECT * FROM grama_niladhari WHERE division_id = ?', [divisionId]);
      if (officerRows.length > 0) {
        return res.status(400).json({ error: 'This GN Division already has an active GN Officer assigned.' });
      }
    } else {
      divisionId = `DIV-${uuidv4().substring(0, 8).toUpperCase()}`;
      await pool.query(
        'INSERT INTO gn_division (division_id, name, district, province) VALUES (?, ?, ?, ?)',
        [divisionId, divisionName, 'Colombo', 'Western']
      );
    }

    // Insert GN Officer
    const gnId = `GN-${uuidv4().substring(0, 8).toUpperCase()}`;
    await pool.query(
      `INSERT INTO grama_niladhari (gn_id, username, password, name, email, mobile, division_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [gnId, username, hashedPassword, name, email, mobile, divisionId]
    );

    res.status(201).json({ success: true, message: 'GN Officer registered successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or Email is already registered.' });
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

    // Get household and division details
    const [hRows] = await pool.query(
      `SELECT h.household_number, d.name AS division_name, d.division_id 
       FROM household h
       JOIN gn_division d ON d.division_id = h.division_id
       WHERE h.household_number = ?`,
      [resident.household_number]
    );
    const division = hRows.length > 0 ? hRows[0].division_name : 'Colombo, Borella';
    const division_id = hRows.length > 0 ? hRows[0].division_id : 'DIV-BORELLA-01';

    const token = generateToken({ id: resident.r_nic, role: 'RESIDENT', name: resident.name });
    res.status(200).json({ 
      success: true, 
      token, 
      user: { 
        nic: resident.r_nic, 
        name: resident.name, 
        email: resident.email,
        division,
        divisionId: division_id,
        householdNumber: resident.household_number
      } 
    });
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

    // Get division details
    const [dRows] = await pool.query('SELECT name FROM gn_division WHERE division_id = ?', [officer.division_id]);
    const divisionName = dRows.length > 0 ? dRows[0].name : 'Colombo, Borella';

    const token = generateToken({ id: officer.gn_id, role: 'OFFICER', name: officer.name });
    res.status(200).json({ 
      success: true, 
      token, 
      user: { 
        id: officer.gn_id, 
        name: officer.name, 
        email: officer.email,
        divisionId: officer.division_id,
        divisionName
      } 
    });
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

// 5. Get Division Residents Count (GN Officer)
router.get('/officer/residents/count', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header required.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const officerId = decoded.id;

    const [rows] = await pool.query(
      `SELECT COUNT(r.r_nic) AS count 
       FROM resident r
       JOIN household h ON h.household_number = r.household_number
       JOIN grama_niladhari gn ON gn.division_id = h.division_id
       WHERE gn.gn_id = ?`,
      [officerId]
    );
    res.status(200).json({ count: rows.length > 0 ? rows[0].count : 0 });
  } catch (err) {
    // Custom header fallback
    const officerId = req.headers['x-user-id'];
    if (officerId) {
      const [rows] = await pool.query(
        `SELECT COUNT(r.r_nic) AS count 
         FROM resident r
         JOIN household h ON h.household_number = r.household_number
         JOIN grama_niladhari gn ON gn.division_id = h.division_id
         WHERE gn.gn_id = ?`,
        [officerId]
      );
      return res.status(200).json({ count: rows.length > 0 ? rows[0].count : 0 });
    }
    res.status(401).json({ error: 'Invalid or expired authorization token.' });
  }
});

export default router;
