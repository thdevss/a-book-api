const conn = require('../configs/database.config.js');
const bcrypt = require("bcryptjs");


const get = async (userId = 0) => {
    if(userId < 1) {
        return {}
    }

    let query_str = `SELECT id, email FROM tb_user WHERE id = ?`
    let query_data = [];
    query_data.push(userId)

    console.log(query_str, query_data)

    const [ rows ] = await conn.execute(query_str, query_data);
    if(rows.length == 1) {
        return rows[0];
    }

    return [];
}


const login = async (email = null, password = null) => {
    if(!email || !password) {
        return {}
    }

    let query_str = `SELECT id, password FROM tb_user WHERE email = ?`
    let query_data = [];
    query_data.push(email)
    console.log(query_str, query_data)

    const [ user ] = await conn.execute(query_str, query_data);
    if(user.length == 1) {
        // check password
        var passwordIsValid = bcrypt.compareSync(
            password,
            user[0].password
        );
        console.log(passwordIsValid, password, user[0].password)

        if (!passwordIsValid) {
            return {}; 
        }

        return user[0];

    }

    return {};
}

module.exports = { 
    login,
    get
};