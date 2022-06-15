const express = require('express');
const { allBook, bookDetail, increaseRatingOfBook, deleteBook } = require('../controllers/bookController');
const router = express.Router();
const isAuthenticate = require('../middlewares/authenticate');

// get all book
router.get('/', allBook);

// get a book detail
router.get('/:bookId', bookDetail);

// increase rating
router.post('/:bookId/rating', isAuthenticate, increaseRatingOfBook);

// create a book
router.post('/', bookDetail);

// update a book [update name/description/price only, for create user only]
router.put('/:bookId', bookDetail);

// delete a book [soft delete, for create user only]
router.delete('/:bookId', isAuthenticate, deleteBook);



module.exports = router;