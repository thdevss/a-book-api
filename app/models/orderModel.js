const conn = require('../configs/database.config.js');
const cartModel = require('./cartModel.js');
const userAddressModel = require('./userAddressModel.js');

const previewBeforeOrder = async (userId = 0) => {
    if(userId < 1) {
        return {
            status: false,
            data: {}
        };
    }
    
    var booksInCart = cartModel.getAllBooksInCart(userId);
    var userAddress = userAddressModel.getOneAddress(0, userId);

    if(booksInCart.length > 0) {
        return {
            status: true,
            data: {
                book: booksInCart,
                address: userAddress,
                // shipping: shippingInformation,
                // payment: paymentInformation
            }
        }
    }

    return {
        status: false,
        data: []
    };
}


module.exports = { 
    previewBeforeOrder
};