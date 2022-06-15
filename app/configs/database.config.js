const mysql = require('mysql2/promise');
require('dotenv').config()

// create the connection to database
const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
conn.getConnection()
module.exports = conn;