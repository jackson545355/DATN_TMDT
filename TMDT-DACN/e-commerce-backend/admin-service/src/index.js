const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;

// Middleware
app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:5173/login', // Chỉ cho phép từ một domain cụ thể
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(cors());


// Routes
app.use('/admin', adminRoutes);

// Database connection
require('./config/db');

app.listen(PORT, () => {
  console.log(`Admin Service is running on port ${PORT}`);
});
