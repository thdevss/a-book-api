const conn = require('../configs/database.config.js');

const getAllBooksInCart = async (userId = 0) => {
    if(userId < 1) {
        return {
            status: false,
            data: []
        };
    }

    let query_str = `SELECT tb_book.id, tb_book.name, tb_book.isbn, tb_book.price, tb_book.discount_percent, ( (tb_book.price*((100-tb_book.discount_percent)/100))*tb_cart.quantity ) as total_price, tb_cart.quantity FROM tb_cart INNER JOIN tb_book ON tb_book.id = tb_cart.book_id WHERE tb_cart.user_id = ?`
    let query_data = [
        userId
    ];

    const [ rows ] = await conn.execute(query_str, query_data);
    if(rows.length > 0) {

        rows.forEach( (row) => {
            row.price = parseFloat(row.price)
            row.total_price = parseFloat(row.total_price)
        })

        return {
            status: true,
            data: rows
        }
    }

    return {
        status: false,
        data: []
    };
}


const addBookToCart = async (userId = 0, bookId = 0, qty = 0) => {
    if(!userId || !bookId || !qty) {
        return {
            status: false,
            message: `input val not valid`
        }
    }

    if(qty < 1) {
        return {
            status: false,
            message: `qty must have`
        }
    }

    // check book is_delete = 0 and is_active = 1 ?
    const [ book ] = await conn.execute(`SELECT COUNT(*) as count FROM tb_book WHERE is_delete = 0 AND is_active = 1 AND id = ?`, [ bookId ]);
    if(parseInt(book[0].count) != 1) {
        return {
            status: false,
            message: `this book was deleted / not active`
        };
    }


    let query_str = `REPLACE INTO tb_cart VALUES (?, ?, ?, NOW())`
    let query_data = [
        bookId,
        userId,
        qty
    ];

    try {
        await conn.execute(query_str, query_data);
        return {
            status: true,
            message: `added to cart!`
        };
    } catch(error) {
        return {
            status: false,
            message: `can't add to cart: ${error.code}`
        };
    }

    return {
        status: false,
        message: 'not thing to do'
    }
}

const deleteBookFromCart = async (userId = 0, bookId = 0) => {
    if(!userId || !bookId) {
        return {
            status: false,
            code: 400,
            message: `input val not valid`
        }
    }

    const [ book ] = await conn.execute(`SELECT COUNT(*) as count FROM tb_cart WHERE book_id = ? AND user_id = ?`, [ bookId, userId ]);
    if(parseInt(book[0].count) != 1) {
        return {
            status: false,
            code: 404,
            message: `this book was deleted / not found`
        };
    }


    let query_str = `DELETE FROM tb_cart WHERE user_id = ? AND book_id = ?`
    let query_data = [
        userId,
        bookId
    ];
   
    try {
        const [ rows ] = await conn.execute(query_str, query_data);
        return {
            status: true,
            code: 204,
            message: `deleted a book in cart!`,
        };
    } catch(error) {
        return {
            status: false,
            code: 500,
            message: `can't delete a book in cart: ${error.code}`
        };
    }

    return {
        status: false,
        message: 'not thing to do'
    }

}


module.exports = { 
    getAllBooksInCart,
    addBookToCart,
    deleteBookFromCart
};