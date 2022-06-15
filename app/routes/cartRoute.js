const express = require('express');
const { allBook, bookDetail } = require('../controllers/bookController');
const router = express.Router();
const isAuthenticate = require('../middlewares/authenticate');

// get product in cart
router.get('/', isAuthenticate, allBook);

// add this product to cart
router.post('/', isAuthenticate, bookDetail);

// delete product from cart
router.delete('/:bookId', isAuthenticate, bookDetail);


module.exports = router;