const express = require('express');
const proxy = require('express-http-proxy');
const config = require('../config/gatewayConfig');

const router = express.Router();

// Authentication Routes
router.use('/auth', proxy(config.AUTH_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl;
  }
}));

// Product Routes
router.use('/products', proxy(config.PRODUCT_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl;
  }
}));

// Order Routes
router.use('/orders', proxy(config.ORDER_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl;
  }
}));

// Inventory Routes
router.use('/inventory', proxy(config.INVENTORY_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl;
  }
}));

// Cart Routes
router.use('/carts', proxy(config.CART_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl;
  }
}));

// Admin Routes
router.use('/admin', proxy(config.ADMIN_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl;
  }
}));

// Admin Routes
router.use('/imgSearch', proxy(config.AI_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl;
  }
}));

module.exports = router;