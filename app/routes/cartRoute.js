const express = require('express');
const { allBook, bookDetail } = require('../controllers/bookController');
const router = express.Router();

// get product in cart
router.get('/', allBook);

// add this product to cart
router.post('/', bookDetail);

// delete product from cart
router.delete('/:bookId', bookDetail);


module.exports = router;