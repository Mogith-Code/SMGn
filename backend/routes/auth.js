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

// Admin authentication middleware
const authAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authorization token.' });
  }
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

// 1.5. Register GN Officer (Restricted to Admin)
router.post('/register/officer', authAdmin, async (req, res) => {
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

// 2. Consolidated Unified Login (Resident, Officer, and Admin)
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and Password are required.' });
    }

    // A. Check Resident table (by NIC)
    const [residentRows] = await pool.query('SELECT * FROM resident WHERE r_nic = ?', [identifier]);
    if (residentRows.length > 0) {
      const resident = residentRows[0];
      if (resident.status !== 'Active') {
        return res.status(403).json({ error: 'Your account is suspended. Please contact the administrator.' });
      }
      const isMatch = await bcrypt.compare(password, resident.password);
      if (isMatch) {
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
        return res.status(200).json({ 
          success: true, 
          token, 
          role: 'RESIDENT',
          user: { 
            nic: resident.r_nic, 
            name: resident.name, 
            email: resident.email,
            division,
            divisionId: division_id,
            householdNumber: resident.household_number
          } 
        });
      }
    }

    // B. Check GN Officer table (by email or username)
    const [officerRows] = await pool.query('SELECT * FROM grama_niladhari WHERE email = ? OR username = ?', [identifier, identifier]);
    if (officerRows.length > 0) {
      const officer = officerRows[0];
      if (officer.status !== 'Active') {
        return res.status(403).json({ error: 'Your officer profile is suspended. Please contact system admin.' });
      }
      const isMatch = await bcrypt.compare(password, officer.password);
      if (isMatch) {
        const [dRows] = await pool.query('SELECT name FROM gn_division WHERE division_id = ?', [officer.division_id]);
        const divisionName = dRows.length > 0 ? dRows[0].name : 'Colombo, Borella';

        const token = generateToken({ id: officer.gn_id, role: 'OFFICER', name: officer.name });
        return res.status(200).json({ 
          success: true, 
          token, 
          role: 'OFFICER',
          user: { 
            id: officer.gn_id, 
            name: officer.name, 
            email: officer.email,
            divisionId: officer.division_id,
            divisionName
          } 
        });
      }
    }

    // C. Check Admin table (by username or email)
    const [adminRows] = await pool.query('SELECT * FROM admin WHERE username = ? OR email = ?', [identifier, identifier]);
    if (adminRows.length > 0) {
      const adminUser = adminRows[0];
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (isMatch) {
        const token = generateToken({ id: adminUser.admin_id, role: 'ADMIN', name: adminUser.name });
        return res.status(200).json({ 
          success: true, 
          token, 
          role: 'ADMIN',
          user: { 
            id: adminUser.admin_id, 
            name: adminUser.name, 
            email: adminUser.email 
          } 
        });
      }
    }

    return res.status(401).json({ error: 'Invalid credentials or account suspended.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2.5 Resident Login (Fallback legacy)
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
    if (resident.status !== 'Active') {
      return res.status(403).json({ error: 'Your account is suspended. Please contact the administrator.' });
    }
    const isMatch = await bcrypt.compare(password, resident.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid NIC number or password.' });
    }
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

// 2.6 GN Officer Login (Fallback legacy)
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
    if (officer.status !== 'Active') {
      return res.status(403).json({ error: 'Your officer profile is suspended. Please contact system admin.' });
    }
    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
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

// 2.7 Admin Login (Fallback legacy)
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

// 3. Get all divisions
router.get('/divisions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT name FROM gn_division');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get all officers (Restricted to Admin)
router.get('/admin/officers', authAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT g.gn_id, g.username, g.name, g.email, g.mobile, g.status, d.name AS division_name 
       FROM grama_niladhari g
       LEFT JOIN gn_division d ON g.division_id = d.division_id`
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get all residents (Restricted to Admin)
router.get('/admin/residents', authAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.r_nic, r.name, r.email, r.mobile_no, r.status, h.address AS division_name 
       FROM resident r
       LEFT JOIN household h ON r.household_number = h.household_number`
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Toggle resident status (Restricted to Admin)
router.put('/admin/residents/:nic/status', authAdmin, async (req, res) => {
  const { nic } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE resident SET status = ? WHERE r_nic = ?', [status, nic]);
    res.status(200).json({ success: true, message: 'Resident status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Toggle officer status (Restricted to Admin)
router.put('/admin/officers/:id/status', authAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE grama_niladhari SET status = ? WHERE gn_id = ?', [status, id]);
    res.status(200).json({ success: true, message: 'GN Officer status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Delete resident profile (Restricted to Admin)
router.delete('/admin/residents/:nic', authAdmin, async (req, res) => {
  const { nic } = req.params;
  try {
    await pool.query('DELETE FROM resident WHERE r_nic = ?', [nic]);
    res.status(200).json({ success: true, message: 'Resident profile deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Delete GN Officer profile (Restricted to Admin)
router.delete('/admin/officers/:id', authAdmin, async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM appointment WHERE gn_id = ?', [id]);
    await connection.query('UPDATE disaster_request SET gn_id = NULL WHERE gn_id = ?', [id]);
    await connection.query('UPDATE allowance_application SET gn_id = NULL WHERE gn_id = ?', [id]);
    await connection.query('UPDATE certificate_request SET gn_id = NULL WHERE gn_id = ?', [id]);
    await connection.query('DELETE FROM grama_niladhari WHERE gn_id = ?', [id]);
    await connection.commit();
    res.status(200).json({ success: true, message: 'GN Officer deleted successfully.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// 9.5. Update resident profile (Restricted to Admin)
router.put('/admin/residents/:nic', authAdmin, async (req, res) => {
  const { nic } = req.params;
  const { name, email, mobile_no, status, occupation, household_number } = req.body;
  try {
    if (!name || !email || !mobile_no || !status || !household_number) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // Verify household
    const [hRows] = await pool.query('SELECT * FROM household WHERE household_number = ?', [household_number]);
    if (hRows.length === 0) {
      await pool.query(
        'INSERT INTO household (household_number, address, division_id) VALUES (?, ?, ?)',
        [household_number, `${household_number}, Temple Road, Borella`, 'DIV-BORELLA-01']
      );
    }

    await pool.query(
      `UPDATE resident 
       SET name = ?, email = ?, mobile_no = ?, status = ?, occupation = ?, household_number = ? 
       WHERE r_nic = ?`,
      [name, email, mobile_no, status, occupation, household_number, nic]
    );

    res.status(200).json({ success: true, message: 'Resident account updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9.6. Update GN Officer profile (Restricted to Admin)
router.put('/admin/officers/:id', authAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, name, email, mobile, division, status } = req.body;
  try {
    if (!username || !name || !email || !mobile || !division || !status) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // Get or create division
    let divisionId = '';
    const [divRows] = await pool.query('SELECT division_id FROM gn_division WHERE name = ? OR name LIKE ?', [division, `%${division}%`]);
    if (divRows.length > 0) {
      divisionId = divRows[0].division_id;
    } else {
      divisionId = `DIV-${uuidv4().substring(0, 8).toUpperCase()}`;
      await pool.query(
        'INSERT INTO gn_division (division_id, name, district, province) VALUES (?, ?, ?, ?)',
        [divisionId, division, 'Colombo', 'Western']
      );
    }

    await pool.query(
      `UPDATE grama_niladhari 
       SET username = ?, name = ?, email = ?, mobile = ?, division_id = ?, status = ? 
       WHERE gn_id = ?`,
      [username, name, email, mobile, divisionId, status, id]
    );

    res.status(200).json({ success: true, message: 'GN Officer updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Get Division Residents Count (GN Officer)
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
