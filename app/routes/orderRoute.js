const express = require('express');
const { allBook, bookDetail } = require('../controllers/bookController');
const router = express.Router();
const isAuthenticate = require('../middlewares/authenticate');

// preview order before save
router.get('/', isAuthenticate, allBook);

// save master-detail order
router.post('/', isAuthenticate, bookDetail);

// get order detail by id [for create user only]
router.get('/:orderId', isAuthenticate, bookDetail);

// save payment detail for this order [for create user only]
router.get('/:orderId/payment', isAuthenticate, bookDetail);


module.exports = router;