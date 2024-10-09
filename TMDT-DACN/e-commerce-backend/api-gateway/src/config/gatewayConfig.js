const dotenv = require('dotenv');
dotenv.config();

// module.exports = {
//   AUTH_SERVICE_URL: 'http://authentication-service:3001',
//   PRODUCT_SERVICE_URL: 'http://product-service:3002',
//   ORDER_SERVICE_URL: 'http://order-service:3003',
//   INVENTORY_SERVICE_URL: 'http://inventory-service:3004',
//   CART_SERVICE_URL: 'http://cart-service:3005',
//   ADMIN_SERVICE_URL:'http://admin-service:3009'
// };

module.exports = {
  AUTH_SERVICE_URL: 'http://localhost:3001',
  PRODUCT_SERVICE_URL: 'http://localhost:3002',
  ORDER_SERVICE_URL: 'http://localhost:3003',
  INVENTORY_SERVICE_URL: 'http://localhost:3004',
  CART_SERVICE_URL: 'http://localhost:3005',
  ADMIN_SERVICE_URL:'http://localhost:3009',
  AI_SERVICE_URL:'http://localhost:3006'
};