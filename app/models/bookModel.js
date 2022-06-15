const conn = require('../configs/database.config.js');

const getAllBooks = async (limit = 10, offset = 0, order = null) => {
    let query_str = `SELECT * FROM tb_book WHERE 1=1 `
    let query_data = [];

    if(order) {
        if(order == 'topsellers') {

        } else if(order == 'recommeneded') {
            // from rating value

        }
        
    }

    // limit
    query_str += ` ORDER BY id DESC LIMIT ?, ?`
    query_data.push(offset)
    query_data.push(limit)

    const [ rows ] = await conn.execute(query_str, query_data);
    return rows;
}

const getOneBook = async (bookId = 0) => {
    if(bookId < 1) {
        return {}
    }

    let query_str = `SELECT * FROM tb_book WHERE id = ?`
    let query_data = [];
    query_data.push(bookId)

    console.log(query_str, query_data)

    const [ rows ] = await conn.execute(query_str, query_data);
    if(rows.length == 1) {
        return rows[0];
    }

    return [];
}

module.exports = { 
    getAllBooks,
    getOneBook
};