const express = require('express');
const { allBook, bookDetail } = require('../controllers/bookController');
const router = express.Router();

// Get payment lists available in website.
router.get('/', bookDetail);


module.exports = router;