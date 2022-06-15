const express = require('express');
const { allBook, bookDetail } = require('../controllers/bookController');
const router = express.Router();

// get all book
router.get('/', allBook);

// get a book detail
router.get('/:bookId', bookDetail);

// increase rating
router.post('/:bookId/rating', bookDetail);

// create a book
router.post('/', bookDetail);

// update a book [update name/description/price only, for create user only]
router.put('/:bookId', bookDetail);

// delete a book [soft delete, for create user only]
router.delete('/:bookId', bookDetail);



module.exports = router;