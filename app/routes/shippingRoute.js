const express = require('express');
const { allBook, bookDetail } = require('../controllers/bookController');
const router = express.Router();

// Get shipping lists available in website.
router.get('/', allBook);


module.exports = router;