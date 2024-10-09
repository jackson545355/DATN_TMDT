const express = require('express');
const dotenv = require('dotenv');
const gatewayRoutes = require('./routes/gatewayRoutes');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Thêm middleware CORS

// Routes
app.use('/', gatewayRoutes);

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
