const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();
const isAuthenticate = require('../middlewares/authenticate');

// get product in cart
router.get('/', isAuthenticate, cartController.getAllBooksInCart);

// add this product to cart
router.post('/', isAuthenticate, cartController.addBookToCart);

// delete product from cart
router.delete('/:bookId', isAuthenticate, cartController.deleteBookFromCart);


module.exports = router;