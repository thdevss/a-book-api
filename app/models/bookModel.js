const conn = require('../configs/database.config.js');

const getAllBooks = async (limit = 10, offset = 0, order = null) => {
    let query_str = `SELECT * FROM tb_book WHERE (is_delete = 0 AND is_active = 1) `
    let query_data = [];

    if(order) {
        if(order == 'topsellers') {

        } else if(order == 'recommeneded') {
            // from rating value
            query_str += ` ORDER BY rating_value DESC`
        }
        
    } else {
        query_str += ` ORDER BY id DESC`
    }

    // limit
    query_str += ` LIMIT ?, ?`
    query_data.push(offset)
    query_data.push(limit)

    const [ rows ] = await conn.execute(query_str, query_data);
    return rows;
}

const getOneBook = async (bookId = 0) => {
    if(bookId < 1) {
        return {}
    }

    let query_str = `SELECT * FROM tb_book WHERE (is_delete = 0 AND is_active = 1) AND id = ?`
    let query_data = [];
    query_data.push(bookId)

    console.log(query_str, query_data)

    const [ rows ] = await conn.execute(query_str, query_data);
    if(rows.length == 1) {
        return rows[0];
    }

    return [];
}

const increaseRatingOfBook = async (bookId = 0, userId = 0, ratingScore = 0) => {
    if(bookId < 1) {
        return {
            status: false,
            message: `book not found`
        };
    }

    if(await isOwnerOfBook(bookId, userId)) {
        return {
            status: false,
            message: `owner can't vote itself's book.`
        };
    }

    let query_str = `INSERT INTO tb_bookrating VALUES (?, ?, ?, NOW())`
    let query_data = [
        userId,
        bookId,
        ratingScore
    ];
    
    try {
        await conn.execute(query_str, query_data);
    } catch (error) {
        return {
            status: false,
            message: `can't save result: ${error.code}`
        };
     }

    // process in tb_book, summary rating
    let query_rep_str = `UPDATE tb_book
    SET 
        rating_value = (SELECT AVG(tb_bookrating.rating_score) FROM tb_bookrating WHERE book_id = tb_book.id), 
        total_rating = (SELECT COUNT(tb_bookrating.rating_score) FROM tb_bookrating WHERE book_id = tb_book.id)
    WHERE id = ?`;
    let query_rep_data = [ bookId ];

    try {
        await conn.execute(query_rep_str, query_rep_data);
    } catch (error) {
        return {
            status: false,
            message: `can't report result: ${error.code}`
        };
     }


    return {
        status: true,
        message: `increased!`
    };
}


const isOwnerOfBook = async (bookId = 0, userId = 0) => {
    if(bookId < 1 || userId < 1) {
        return true;
    }

    const [ rows ] = await conn.execute(`SELECT id FROM tb_book WHERE user_id = ? AND id = ?`, [ userId, bookId ]);
    if(rows.length == 1) {
        return true;
    }

    return false;
}


const deleteBook = async (bookId = 0, userId = 0) => {
    if(bookId < 1) {
        return {
            status: false,
            message: `book not found`
        };
    }
    
    if(await !isOwnerOfBook(bookId, userId)) {
        return {
            status: false,
            message: `only owner can delete this book`
        };
    }

    let query_str = `UPDATE tb_book SET is_delete = 1 WHERE is_delete = 0 AND id = ? AND user_id = ?`
    let query_data = [
        bookId,
        userId
    ];
    
    try {
        const [ rows ] = await conn.execute(query_str, query_data);
        if(rows.affectedRows == 1) {
            return {
                status: true,
                message: `deleted!`
            };
        }
    } catch (error) {
        return {
            status: false,
            message: `can't delete book: ${error.code}`
        };
    }


    return {
        status: false,
        message: `not thing to do!`
    };
}


module.exports = { 
    getAllBooks,
    getOneBook,
    increaseRatingOfBook,
    isOwnerOfBook,
    deleteBook
};

