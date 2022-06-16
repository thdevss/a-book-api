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
            message: `book not found`,
            data: {}
        })
        return;
    }

    res.json({
        status: true,
        message: `found a book`,
        data: row
    })
}


const increaseRatingOfBook = async (req, res) => {

    var bookId = (parseInt(req.params.bookId) || 0)
    if(!bookId) {
        res.status(404).json({
            status: false,
            message: `book not found`,
            data: {}
        })
        return;
    }

    var ratingScore = (parseFloat(req.body.ratingScore) || 0)
    if(ratingScore > 5) {
        res.status(500).json({
            status: false,
            message: `ratingScore value invalid`,
            data: {}
        })
        return;
    }

    var isOwnerOfBook = await book.isOwnerOfBook(bookId, req.user.id)
    if(isOwnerOfBook) {
        res.status(500).json({
            status: false,
            message: `owner can't vote itself's book.`,
            data: {}
        })
        return;
    }

    var result = await book.increaseRatingOfBook(bookId, req.user.id, ratingScore)

    res.json({
        status: result.status,
        message: result.message,
        data: {}
    })
}

const deleteBook = async (req, res) => {

    var bookId = (parseInt(req.params.bookId) || 0)
    if(!bookId) {
        res.status(404).json({
            status: false,
            message: `book not found`,
            data: {}
        })
        return;
    }

    var isOwnerOfBook = await book.isOwnerOfBook(bookId, req.user.id)
    if(!isOwnerOfBook) {
        res.status(500).json({
            status: false,
            message: `only owner can delete this book`,
            data: {}
        })
        return;
    }

    var result = await book.deleteBook(bookId, req.user.id)

    res.json({
        status: result.status,
        message: result.message,
        data: {}
    })
}

const addNewBook = async (req, res) => {
    var bookPrice = (parseInt(req.body.price) || 0)
    if(!bookPrice || bookPrice < 1) {
        res.status(500).json({
            status: false,
            message: `price not valid`,
            data: {}
        })
        return;
    }
    var bookDiscountPercent = (parseInt(req.body.discount_percent) || 0)
    if(bookDiscountPercent < 0) {
        res.status(500).json({
            status: false,
            message: `discount_percent not valid`,
            data: {}
        })
        return;
    }

    var bookName = req.body.name
    if(!bookName) {
        res.status(500).json({
            status: false,
            message: `name must not null`,
            data: {}
        })
        return;
    }

    var result = await book.addNewBook(
        req.body.bookISBN,
        bookName,
        req.body.description,
        bookPrice,
        bookDiscountPercent,
        req.user.id
    )

    res.json({
        status: result.status,
        message: result.message,
        data: (await book.getOneBook(result.id))
    })
}

const updateBook = async (req, res) => {
    var bookId = (parseInt(req.params.bookId) || 0)
    if(!bookId) {
        res.status(404).json({
            status: false,
            message: `book not found`,
            data: {}
        })
        return;
    }

    var isOwnerOfBook = await book.isOwnerOfBook(bookId, req.user.id)
    if(!isOwnerOfBook) {
        res.status(500).json({
            status: false,
            message: `only owner can delete this book`,
            data: {}
        })
        return;
    }

    var bookPrice = (parseInt(req.body.price) || 0)
    if(bookPrice < 1) {
        res.status(500).json({
            status: false,
            message: `price not valid`,
            data: {}
        })
        return;
    }

    var bookDiscountPercent = (parseInt(req.body.discount_percent) || 0)
    if(bookDiscountPercent < 0) {
        res.status(500).json({
            status: false,
            message: `discount_percent not valid`,
            data: {}
        })
        return;
    }

    var isActive = (parseInt(req.body.is_active))
    if(isActive != 0 && isActive != 1) {
        res.status(500).json({
            status: false,
            message: `is_active not valid (boolean only 0/1)`,
            data: {}
        })
        return;
    }
    console.log(req.body.is_active, isActive)


    var bookName = req.body.name
    var result = await book.updateBook(
        bookId,
        req.body.bookISBN,
        bookName,
        req.body.description,
        bookPrice,
        bookDiscountPercent,
        isActive,
        req.user.id
    )

    res.json({
        status: result.status,
        message: result.message,
        data: (await book.getOneBook(bookId))
    })
}


module.exports =  {
    allBook,
    bookDetail,
    increaseRatingOfBook,
    deleteBook,
    addNewBook,
    updateBook
};