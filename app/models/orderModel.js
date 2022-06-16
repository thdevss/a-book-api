const conn = require('../configs/database.config.js');
const cartModel = require('./cartModel.js');
const userAddressModel = require('./userAddressModel.js');
const paymentModel = require('./paymentModel.js');
const shippingModel = require('./shippingModel.js');
const userModel = require('./userModel.js');


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

const calcSummaryPrice = async (bookObj = {}, shippingObj = {}) => {
    var summary_price = {
        book_price: 0,
        shipping_price: 0,
        total_price: 0,
        book_quantity: 0
    }
    bookObj.forEach( (product) => {
        summary_price.book_price += product.total_price
        summary_price.book_quantity += product.quantity
    })
    // calc. shipping
    summary_price.shipping_price = (summary_price.book_quantity * shippingObj.price_per_piece)
    summary_price.total_price = summary_price.shipping_price+summary_price.book_price;
    
    return summary_price;
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

    var check_data = await checkDataBeforeOrder(booksInCart, userAddress, shippingInformation, paymentInformation);

    if(!check_data.status) {
        return {
            status: false,
            message: check_data.message,
            data: {}
        }
    } else {
        
        return {
            status: true,
            data: {
                book: booksInCart.data,
                address: userAddress.data,
                shipping: shippingInformation.data,
                payment: paymentInformation.data,
                summary: await calcSummaryPrice(booksInCart.data, shippingInformation.data)
            },
            message: 'success'
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

    var check_data = await checkDataBeforeOrder(booksInCart, userAddress, shippingInformation, paymentInformation);
    if(!check_data.status) {
        return {
            status: false,
            message: check_data.message,
            data: {}
        }
    } else {
        
        var userInfo = await userModel.getOneUser(userId)
        // -- create new order here
        var summary_price = await calcSummaryPrice(booksInCart.data, shippingInformation.data)

        // create in tb_order
        var ins_master_query_str = `INSERT INTO tb_order (user_id, book_quantity, total_book_price, total_shipping_price, total_grand_price, payment_id, payment_name, shipping_id, shipping_name, shipping_price_per_piece, address_id, address_1, address_2, address_sub_district, address_district, address_province, address_postel_code, address_country, first_name, last_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? NOW())`
        
        var ins_master_query_data = [
            userId,
            summary_price.book_quantity,
            summary_price.book_price,
            summary_price.shipping_price,
            summary_price.total_price,
            paymentInformation.data.id,
            paymentInformation.data.name,
            shippingInformation.data.id,
            shippingInformation.data.name,
            shippingInformation.data.price_per_piece,
            userAddress.data.id,
            userAddress.data.address_1,
            userAddress.data.address_2,
            userAddress.data.address_sub_district,
            userAddress.data.address_district,
            userAddress.data.address_province,
            userAddress.data.address_postel_code,
            userAddress.data.address_country,
            userInfo.data.first_name,
            userInfo.data.last_name,

        ];

        var orderId = 0;
        try {
            const [ created ] = await conn.execute(ins_master_query_str, ins_master_query_data);
            
            if(created.affectedRows == 1) {
                orderId = created.insertId
            }
        } catch (error) {
            return {
                status: false,
                message: `can't create order: ${error.code}`
            };
        }
        
        // create in tb_order_detail
        if(orderId == 0) {
            return {
                status: false,
                message: `can't x create order: ${error.code}`
            };
        }

        var ins_detail_query_str = `INSERT INTO tb_order_detail (order_id, book_id, book_isbn, book_name, book_price, book_discount_percent, quantity, shipping_price_per_piece, total_book_price, total_shipping_price, total_grand_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        var itemsProcessed = 0;
        // booksInCart.data.forEach( async (book) => {
        for (let book of booksInCart.data) {
                
            console.log(book)
            var ins_detail_query_data = [
                orderId,
                book.id,
                book.isbn,
                book.name,
                book.price,
                book.discount_percent,
                book.quantity,
                shippingInformation.data.price_per_piece,
                book.total_price,
                (shippingInformation.data.price_per_piece * book.quantity),
                (book.total_price+(shippingInformation.data.price_per_piece * book.quantity))
            ]

            try {
                const [ detailCreated ] = await conn.execute(ins_detail_query_str, ins_detail_query_data);
                const [ deleteInCart ] = await conn.execute(`DELETE FROM tb_cart WHERE book_id = ? AND user_id = ?`, [ book.id, userId ]);

                itemsProcessed++;
                console.log(itemsProcessed, booksInCart.data.length)
                if(itemsProcessed === booksInCart.data.length) {
                    console.log('comp')
                    return {
                        status: true,
                        message: `create order succeed, please payment.`,
                        id: orderId
                    };
                }
                // console.log((ins_detail_query_str, ins_detail_query_data), detailCreated)
            } catch (error) {
                // console.log(error)
                return {
                    status: false,
                    message: `can't create order detail: ${error.code}`
                };
            }
        }

        
    }




    return {
        status: false,
        message: 'not thing to do'
    };
}

const getOneOrder = async (userId = 0, orderId = 0) => {
    if(userId < 1) {
        return {
            status: false,
            data: []
        };
    }

    let order_mas_query_str = `SELECT * FROM tb_order WHERE user_id = ? AND id = ?`
    let order_mas_query_data = [
        userId,
        orderId
    ];

    const [ rowOrder ] = await conn.execute(order_mas_query_str, order_mas_query_data);
    if(rowOrder.length == 1) {

        const [ rowBooks ] = await conn.execute(`SELECT * FROM tb_order_detail WHERE order_id = ?`, [ orderId ]);

        rowBooks.forEach( (row) => {
            row.shipping_price_per_piece = parseFloat(row.shipping_price_per_piece)
            row.book_price = parseFloat(row.book_price)
            row.total_book_price = parseFloat(row.total_book_price)
            row.total_shipping_price = parseFloat(row.total_shipping_price)
            row.total_grand_price = parseFloat(row.total_grand_price)
        })

        rowOrder[0].total_book_price = parseFloat(rowOrder[0].total_book_price)
        rowOrder[0].total_shipping_price = parseFloat(rowOrder[0].total_shipping_price)
        rowOrder[0].total_grand_price = parseFloat(rowOrder[0].total_grand_price)
        rowOrder[0].shipping_price_per_piece = parseFloat(rowOrder[0].shipping_price_per_piece)

        return {
            status: true,
            data: {
                order: rowOrder[0],
                book: rowBooks
            }
        }
    }

    return {
        status: false,
        data: []
    };
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