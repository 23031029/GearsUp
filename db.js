/*
 I declare that this code was written by me. 
 I will not copy or allow others to copy my code. 
 I understand that copying code is considered as plagiarism.
 
 Student Name: Toh Ser Jia
 Student ID: 23031029
 Class: C372-2D-E63C-A
 Date created: 10/02/2025
 */

const mysql = require('mysql2');

//Database connection details
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'C207',
    database: 'gears_up'
  });


//Connecting to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = db;