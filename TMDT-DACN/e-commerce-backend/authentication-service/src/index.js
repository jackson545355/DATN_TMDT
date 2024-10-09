const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors()); // Thêm middleware CORS

// Routes
app.use('/auth', authRoutes);

// Database connection
require('./config/db');

app.listen(PORT, () => {
  console.log(`Authentication Service is running on port ${PORT}`);
});