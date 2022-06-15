const book = require('../models/bookModel.js');

const allBook = async (req, res) => {
    var book_filter = {
        limit: (typeof req.query.limit  != 'undefined')? (parseInt(req.query.limit) || 0) : 10,
        offset: (typeof req.query.offset != 'undefined') ? (parseInt(req.query.offset) || 0) : 0,
        order: (typeof req.query.order != 'undefined') ? req.query.order : null
    }

    var rows = await book.getAllBooks(book_filter.limit, book_filter.offset, book_filter.order);

    res.json({
        status: true,
        data: rows
    })
}

const bookDetail = async (req, res) => {
    var bookId = (parseInt(req.params.bookId) || 0)
    var row = await book.getOneBook(bookId);
    
    if(!row) {
        res.status(404).json({
            status: false,
            data: {}
        })
    }

    res.json({
        status: true,
        data: row
    })
}
module.exports =  {
    allBook,
    bookDetail
};