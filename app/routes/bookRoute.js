const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();
const isAuthenticate = require('../middlewares/authenticate');

// get all book
router.get('/', bookController.allBook);

// get a book detail
router.get('/:bookId', bookController.bookDetail);

// increase rating
router.post('/:bookId/rating', isAuthenticate, bookController.increaseRatingOfBook);

// create a book
router.post('/', isAuthenticate, bookController.addNewBook);

// update a book [update name/description/price only, for create user only]
router.put('/:bookId', isAuthenticate, bookController.updateBook);

// delete a book [soft delete, for create user only]
router.delete('/:bookId', isAuthenticate, bookController.deleteBook);



module.exports = router;