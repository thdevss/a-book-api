const conn = require('../configs/database.config.js');
const bcrypt = require("bcryptjs");


const getOneUser = async (userId = 0) => {
    if(userId < 1) {
        return {
            status: false,
            message: `user not found`
        }
    }

    let query_str = `SELECT id, email, first_name, last_name, phone_number FROM tb_user WHERE id = ?`
    let query_data = [];
    query_data.push(userId)

    console.log(query_str, query_data)

    const [ rows ] = await conn.execute(query_str, query_data);
    if(rows.length == 1) {
        return {
            status: true,
            data: rows[0]
        }
    }

    return {
        status: false,
        message: `user not found`
    }
}


const login = async (email = null, password = null) => {
    if(!email || !password) {
        return {
            status: false,
            message: `input invalid`
        }; 
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
            return {
                status: false,
                message: `password invalid`
            }; 
        }

        return {
            status: true,
            message: `login succeed`,
            data: user[0]
        }; 

    }

    return {
        status: false,
        message: `account not found`
    }; 
}

const hasEmail = async (email = null) => {
    if(!email) {
        return false;
    }

    const [ rows ] = await conn.execute(`SELECT email FROM tb_user WHERE email = ?`, [ email ]);
    if(rows.length > 0) {
        return true;
    }

    return false;
}

const register = async (email = null, password = null, firstName = null, lastName = null, phoneNumber = null) => {
    if(!email || !password) {
        return {
            status: false,
            message: `input not valid`
        }
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let query_str = `INSERT INTO tb_user (email, password, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?)`
    let query_data = [
        email,
        password,
        firstName,
        lastName,
        phoneNumber
    ];

    try {
        const [ user ] = await conn.execute(query_str, query_data);

        if(user.insertId > 0) {
            return {
                status: true,
                message: `register succeed`
            }

        }
    } catch (error) {
        return {
            status: false,
            message: `can't register user: ${error.code}`
        };
     }


    return {
        status: false,
        message: `not thing to do`
    }
}

module.exports = { 
    login,
    register,
    hasEmail,
    getOneUser
};