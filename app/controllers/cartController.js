const cartModel = require('../models/cartModel.js');
const {validationResult} = require('express-validator');


const getAllBooksInCart = async (req, res) => {


    var books = await cartModel.getAllBooksInCart(req.user.id);
    if(books) {
        var total_price = 0;
        books.data.forEach( (product) => {
            total_price += product.total_price
        })
        res.json({ 
            success: true,
            data: {
                book: books.data,
                summary: {
                    price: total_price
                }
            }
        });
        return;
    }

    res.status(204).json({
        success: true,
        data: {}
    })
}


const addBookToCart = async (req, res) => {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: true,
            message: `input not valid`,
            data: errors.array()
        });
    }

    if(req.body.quantity < 1) {
        res.status(400).json({
            success: false,
            message: `qty must > 0`
        })
        return;
    }

    
    var result = await cartModel.addBookToCart(req.user.id, req.body.book_id, req.body.quantity);
    if(result.status) {
        res.json({ 
            success: true,
            message: result.message
        });
        return;
    } else {
        res.status(500).json({
            success: false,
            message: result.message,
        })
        return;
    }

}

const deleteBookFromCart = async (req, res) => {

    var result = await cartModel.deleteBookFromCart(req.user.id, req.params.bookId);
    if(result.status) {
        res.status(result.code).json({ 
            success: true,
            message: result.message
        });
        return;
    } else {
        res.status(result.code).json({
            success: false,
            message: result.message,
            data: {}
        })
        return;
    }

}




module.exports =  {
    getAllBooksInCart,
    addBookToCart,
    deleteBookFromCart
};