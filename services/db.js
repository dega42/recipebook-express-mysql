const mysql = require('mysql');
require('dotenv').config();

// Create connection to MySQL
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    dateStrings: 'date',
    multipleStatements: true
});

// Open MySQL connection
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

module.exports = connection;