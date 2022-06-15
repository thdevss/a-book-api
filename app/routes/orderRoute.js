const express = require('express');
const { allBook, bookDetail } = require('../controllers/bookController');
const router = express.Router();

// preview order before save
router.get('/', allBook);

// save master-detail order
router.post('/', bookDetail);

// get order detail by id [for create user only]
router.get('/:orderId', bookDetail);

// save payment detail for this order [for create user only]
router.get('/:orderId/payment', bookDetail);


module.exports = router;