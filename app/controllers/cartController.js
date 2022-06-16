const cartModel = require('../models/cartModel.js');

const jwt = require('jsonwebtoken');
const config = require("../configs/auth.config.js");

const getAllBooksInCart = async (req, res) => {

    var books = await cartModel.getAllBooksInCart(req.user.id);
    if(books) {
        var total_price = 0;
        books.data.forEach( (product) => {
            total_price += product.total_price
        })
        res.json({ 
            status: true,
            data: {
                book: books.data,
                summary: {
                    price: total_price
                }
            }
        });
        return;
    }

    res.status(401).json({
        status: false,
        data: {}
    })
}


const addBookToCart = async (req, res) => {

    var result = await cartModel.addBookToCart(req.user.id, req.body.book_id, req.body.quantity);
    if(result.status) {
        res.json({ 
            status: true,
            message: result.message
        });
        return;
    } else {
        res.status(500).json({
            status: false,
            message: result.message,
            data: {}
        })
        return;
    }

    res.status(401).json({
        status: false,
        data: {}
    })
}

const deleteBookFromCart = async (req, res) => {

    var result = await cartModel.deleteBookFromCart(req.user.id, req.params.bookId);
    if(result.status) {
        res.json({ 
            status: true,
            message: result.message
        });
        return;
    } else {
        res.status(500).json({
            status: false,
            message: result.message,
            data: {}
        })
        return;
    }

    res.status(401).json({
        status: false,
        data: {}
    })
}




module.exports =  {
    getAllBooksInCart,
    addBookToCart,
    deleteBookFromCart
};