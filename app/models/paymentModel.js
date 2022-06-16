const conn = require('../configs/database.config.js');

const getAllPayment = async () => {

    let query_str = `SELECT * FROM tb_payment`

    const [ rows ] = await conn.execute(query_str, []);
    if(rows.length > 0) {
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

const getOnePayment = async (paymentId = 0) => {
    let query_str = `SELECT * FROM tb_payment WHERE 1=1 `
    let query_data = [];
    if(paymentId > 0) {
        query_str += ` AND id = ? `;
        query_data.push(paymentId)
    } else {
        query_str += ` AND is_default = 1 `
    }

    query_str += ` LIMIT 1 `
    const [ rows ] = await conn.execute(query_str, query_data);
    if(rows.length == 1) {
        return {
            status: true,
            data: rows[0]
        }
    }

    return {
        status: false,
        data: []
    };
}


module.exports = { 
    getAllPayment,
    getOnePayment
};