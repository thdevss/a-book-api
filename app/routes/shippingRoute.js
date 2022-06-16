const express = require('express');
const shippingController = require('../controllers/shippingController');
const router = express.Router();

// Get shipping lists available in website.
router.get('/', shippingController.getAllShipping);


module.exports = router;