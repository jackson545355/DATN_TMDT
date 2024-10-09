const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());
app.use(cors()); // Thêm middleware CORS

// Routes
app.use('/carts', cartRoutes);

// Connect to the database
require('./config/db');

app.listen(PORT, () => {
  console.log(`Cart Service is running on port ${PORT}`);
});
