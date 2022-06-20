const book = require('../models/bookModel.js');
const {validationResult} = require('express-validator');

const allBook = async (req, res) => {
    var book_filter = {
        limit: (typeof req.query.limit  != 'undefined')? (parseInt(req.query.limit) || 0) : 10,
        offset: (typeof req.query.offset != 'undefined') ? (parseInt(req.query.offset) || 0) : 0,
        order: (typeof req.query.order != 'undefined') ? req.query.order : null,
        name: (typeof req.query.name != 'undefined') ? req.query.name : null

    }
    var rows = await book.getAllBooks(book_filter.limit, book_filter.offset, book_filter.order, book_filter.name);

    if(rows.length > 0) {
        return res.json({
            success: true,
            data: rows
        })
    }


    return res.status(200).json({
        success: false,
        data: []
    })
}

const bookDetail = async (req, res) => {
    var bookId = (parseInt(req.params.bookId) || 0)
    var row = await book.getOneBook(bookId);
    
    if(!row || !row.id) {
        return res.status(404).json({
            success: false,
            message: `book not found`,
            data: {}
        })
    }

    return res.json({
        success: true,
        message: `found a book`,
        data: row
    })
}


const increaseRatingOfBook = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: `input not valid`,
            data: errors.array()
        });
    }
    

    var bookId = (parseInt(req.params.bookId) || 0)
    if(!bookId) {
        return res.status(404).json({
            success: false,
            message: `book not found`,
            data: {}
        })
    }

    var ratingScore = (parseFloat(req.body.ratingScore) || 0)
    if(ratingScore > 5 || ratingScore < 1) {
        return res.status(400).json({
            success: false,
            message: `ratingScore value invalid`,
            data: {}
        })
    }

    var isOwnerOfBook = await book.isOwnerOfBook(bookId, req.user.id)
    if(isOwnerOfBook) {
        return res.status(403).json({
            success: false,
            message: `owner can't vote itself's book.`,
            data: {}
        })
    }

    var result = await book.increaseRatingOfBook(bookId, req.user.id, ratingScore)

    if(result.status) {
        return res.json({
            status: result.status,
            message: result.message,
            data: {}
        })
    }

    return res.status(500).json({
        status: result.status,
        message: result.message,
        data: {}
    })
    
}

const deleteBook = async (req, res) => {

    var bookId = (parseInt(req.params.bookId) || 0)
    if(!bookId) {
        res.status(404).json({
            success: false,
            message: `book not found`,
            data: {}
        })
        return;
    }

    var isOwnerOfBook = await book.isOwnerOfBook(bookId, req.user.id)
    if(!isOwnerOfBook) {
        res.status(403).json({
            success: false,
            message: `only owner can delete this book`,
            data: {}
        })
        return;
    }

    var result = await book.deleteBook(bookId, req.user.id)

    if(result.status) {
        return res.status(204).json({
            success: result.status,
            message: result.message,
            data: {}
        })
    }

    return res.status(500).json({
        success: result.status,
        message: result.message,
        data: {}
    })
}

const addNewBook = async (req, res) => {
    var bookPrice = (parseInt(req.body.price) || 0)
    if(!bookPrice || bookPrice < 1) {
        res.status(400).json({
            success: false,
            message: `price not valid`,
            data: {}
        })
        return;
    }
    var bookDiscountPercent = (parseInt(req.body.discount_percent) || 0)
    if(bookDiscountPercent < 0 || bookDiscountPercent > 100) {
        res.status(400).json({
            success: false,
            message: `discount_percent not valid`,
            data: {}
        })
        return;
    }

    var bookName = req.body.name
    if(!bookName) {
        res.status(400).json({
            success: false,
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

    res.status(201).json({
        status: result.status,
        message: result.message,
        data: (await book.getOneBook(result.id))
    })
}

const updateBook = async (req, res) => {
    var bookId = (parseInt(req.params.bookId) || 0)
    if(!bookId) {
        res.status(404).json({
            success: false,
            message: `book not found`,
            data: {}
        })
        return;
    }

    var isOwnerOfBook = await book.isOwnerOfBook(bookId, req.user.id)
    if(!isOwnerOfBook) {
        res.status(403).json({
            success: false,
            message: `only owner can update this book`,
            data: {}
        })
        return;
    }

    var bookPrice = (parseInt(req.body.price) || 0)
    if(bookPrice < 1) {
        res.status(400).json({
            success: false,
            message: `price not valid`,
            data: {}
        })
        return;
    }

    var bookDiscountPercent = (parseInt(req.body.discount_percent) || 0)
    if(bookDiscountPercent < 0) {
        res.status(400).json({
            success: false,
            message: `discount_percent not valid`,
            data: {}
        })
        return;
    }

    var isActive = (Number(req.body.is_active))
    if(isActive != 0 && isActive != 1) {
        res.status(400).json({
            success: false,
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