const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

// Get payment lists available in website.
router.get('/', paymentController.getAllPayment);


module.exports = router;