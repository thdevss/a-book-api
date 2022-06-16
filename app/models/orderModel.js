const conn = require('../configs/database.config.js');
const cartModel = require('./cartModel.js');
const userAddressModel = require('./userAddressModel.js');
const paymentModel = require('./paymentModel.js');
const shippingModel = require('./shippingModel.js');


const checkDataBeforeOrder = async (bookObj = {}, userAddressObj = {}, shippingObj = {}, paymentObj = {}) => {
    if(!bookObj.status || bookObj.data.length < 1) {
        return {
            status: false,
            message: `cart is empty`
        }
    } else if(!userAddressObj.status) {
        return {
            status: false,
            message: `no user address`
        }
    } else if(!shippingObj.status) {
        return {
            status: false,
            message: `no shipping information`
        }
    } else if(!paymentObj.status) {
        return {
            status: false,
            message: `no payment information`
        }
    } 

    return {
        status: true,
        message: `can create new order`
    }
}

const previewBeforeOrder = async (userId = 0, addressId = 0, shippingId = 0, paymentId = 0) => {
    if(userId < 1) {
        return {
            status: false,
            message: `int error`,
            data: {}
        };
    }
    
    var booksInCart = await cartModel.getAllBooksInCart(userId);
    var userAddress = await userAddressModel.getOneAddress(addressId, userId);

    var shippingInformation = await shippingModel.getOneShipping(shippingId);
    var paymentInformation = await paymentModel.getOnePayment(paymentId);

    var check_data = checkDataBeforeOrder(booksInCart, userAddress, shippingInformation, paymentInformation);
    if(!check_data.status) {
        return {
            status: false,
            message: check_data.message,
            data: {}
        }
    } else {
        var summary_price = {
            book: 0,
            shipping: 0,
            total: 0
        }
        booksInCart.data.forEach( (product) => {
            summary_price.book += product.total_price
        })
        // calc. shipping
        summary_price.shipping = (booksInCart.data.length * shippingInformation.data.price_per_piece)
        summary_price.total = summary_price.shipping+summary_price.book;
        
        return {
            status: true,
            data: {
                book: booksInCart.data,
                address: userAddress.data,
                shipping: shippingInformation.data,
                payment: paymentInformation.data,
                summary: summary_price
            }
        }
    }

    return {
        status: false,
        data: []
    };
}

const createNewOrder = async (userId = 0, addressId = 0, shippingId = 0, paymentId = 0) => {
    var booksInCart = await cartModel.getAllBooksInCart(userId);
    var userAddress = await userAddressModel.getOneAddress(addressId, userId);

    var shippingInformation = await shippingModel.getOneShipping(shippingId);
    var paymentInformation = await paymentModel.getOnePayment(paymentId);

    var check_data = checkDataBeforeOrder(booksInCart, userAddress, shippingInformation, paymentInformation);
    if(!check_data.status) {
        return {
            status: false,
            message: check_data.message,
            data: {}
        }
    } else {
        // -- create new order here

        // create in tb_order

        // create in tb_order_detail


    }

    return {
        status: false,
        data: []
    };
}

const getOneOrder = async (userId = 0, orderId = 0) => {
    
}

const getallOrderByUser = async (userId = 0) => {
    
}

const updateOrder = async (userId = 0, orderId = 0, orderStatus = null) => {
    
}

module.exports = { 
    previewBeforeOrder,
    createNewOrder,
    getOneOrder,
    getallOrderByUser,
    updateOrder
};