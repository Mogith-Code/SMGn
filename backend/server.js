import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import certificateRoutes from './routes/certificates.js';
import allowanceRoutes from './routes/allowances.js';
import disasterRoutes from './routes/disasters.js';
import appointmentRoutes from './routes/appointments.js';
import announcementRoutes from './routes/announcements.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core API Routers
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/allowances', allowanceRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/announcements', announcementRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SmartGN Secure Backend System is Active.' });
});

// 404 Route Catch-All
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found.' });
});

// Express Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR LOG:', err.stack);
  res.status(500).json({ error: 'Internal Server Error. Please contact support.' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SmartGN Secure Node.js Server Active on Port: ${PORT}`);
  console.log(`  Targeting Environment: production-mysql-node`);
  console.log(`=======================================================`);
});
