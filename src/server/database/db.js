/*const mysql = require('mysql2/promise');
const dotenv = require('dotenv')
dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',    
    user: 'root',
    password: 'admin1234',
    database: 'ing2',
    waitForConnections: true,
    connectionLimit: 2,
});

async function getConn() {
    try {
        let conn = await pool.getConnection();
        return conn;
    }
    catch {
        console.error('Error getting MySQL connection:', err);
        throw err;
    }
}

module.exports = {
    getConn
};*/
const mysql = require('mysql2/promise');
const dotenv = require('dotenv')
dotenv.config();

const pool = mysql.createPool({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     waitForConnections: true,
     connectionLimit: 2,
     queueLimit: 0 
});

async function getConn() {
    try {
        let conn = await pool.getConnection();    
        return conn;
    }
    catch {
        console.error('Error getting MySQL connection:', err);
        throw err;
    }
}

module.exports = {
    getConn
}