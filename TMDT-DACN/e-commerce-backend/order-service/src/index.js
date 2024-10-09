const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Thêm middleware CORS

// Routes
app.use('/orders', orderRoutes);

// Connect to the database
require('./config/db');

app.listen(PORT, () => {
  console.log(`Order Service is running on port ${PORT}`);
});
