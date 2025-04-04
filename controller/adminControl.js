const db = require('../db');

/*
 I declare that this code was written by me. 
 I will not copy or allow others to copy my code. 
 I understand that copying code is considered as plagiarism.
 
 Student Name: Toh Ser Jia
 Student ID: 23031029
 Class: C372-2D-E63C-A
 Date created: 10/02/2025
 */


//Dashboard
exports.getDashboard= (req,res)=>{
    const sqlCompany= `SELECT * FROM company`;
    db.query(sqlCompany, (error, companyResult)=>{
        if(error){
            console.error('Database query error', error.message)
            return res.status(500).send('Error Retreiving company table');
        }
        res.render('admin/dashboard', {
            company: companyResult,
        });
    });
};

// Get Admin User Page
exports.getUser = (req, res) => {
    const sqlUser = `SELECT * FROM user`;
    db.query(sqlUser, (err, userResult) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("Error retrieving user table.");
        }

        const sqlCompany = `SELECT * FROM company`;
        db.query(sqlCompany, (error, companyResult) => {
            if (error) {
                console.error("Database query error:", error.message);
                return res.status(500).send("Error retrieving company table.");
            }

            res.render('admin/adminUser', {
                userList: userResult,
                company: companyResult,
            });
        });
    });
};

// Delete a user by username
exports.deleteUser = (req, res) => {
    const userId = req.params.username; 

    const sqlDelete = `DELETE FROM user WHERE username = ?`;

    db.query(sqlDelete, [userId], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err.message);
            return res.status(500).send("Error deleting user.");
        }
        console.log(`User with username ${userId} deleted successfully.`);
        res.redirect('/adminUser');
    });
};

//Get Adduser page
exports.getAddUser = (req, res) => {
    const sqlCompany = `SELECT * FROM company`;
    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("Error retrieving user table.");
        }
        res.render('admin/addUser', {
            company: companyResult,
        });
    });
};

//Add admin 
exports.postAddUser= (req, res)=>{
    const {username, email, phoneNumber, fullName, password}= req.body;
    let image= req.body.image;
    if (req.file){
        image= req.file.filename;
    } else{
        image="default.png";
    }

    const checkUsername= "SELECT * from user WHERE username= ?";

    db.query(checkUsername, [username],(err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error checking username');
            return res.redirect('/addAdmin');
        } 
        if (result.length > 0) {
            req.flash('error', 'Username already taken. Please choose a different one.');
            return res.redirect('/addAdmin');
        }

        const sql= `INSERT INTO user (username, fullName, email, phoneNumber, password, image, role) 
        VALUES(?, ?, ?, ?, SHA1(?), ?, "admin") `;

        db.query(sql, [username, fullName, email, phoneNumber, password, image], (err) => {
            if (err) {
                console.error(err);
                req.flash('error', 'Error registering admin');
                return res.redirect('/addAdmin');
            }
            req.flash('success', 'Registration successful!.');
            res.redirect('/adminUser');
        });
    });
};
