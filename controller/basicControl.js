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

//Get future Update
exports.getfuture= (req,res)=>{
    const sqlCompany= `SELECT * FROM company`;
    //Company query
    db.query(sqlCompany, (error, companyResult)=>{
        if(error){
            console.error('Database query error', error.message)
            return res.status(500).send('Error Retreiving company table');
        }
            res.render('customer/futureUpdate', {
                company: companyResult,
        });
    });
}

// Get search
exports.getSearch = (req, res) => {
    const search = req.query.search;
    console.log('User searched for:', search);

    const searchTerm = `%${search}%`;

    const sqlCompany = `SELECT * FROM company`;

    const sql = `
       SELECT 
    product.productID,
    product.name, 
    product.description, 
    product.image, 
    product.price, 
    brand.brandName AS brand, 
    category.name AS category,
    subcategory.name AS subcategory
    FROM product
    LEFT JOIN brand ON brand.brandID = product.brand
    LEFT JOIN category ON category.categoryID = product.categoryID
    LEFT JOIN subcategory ON subcategory.subCategoryID = product.subCategoryID
    WHERE 
    product.name LIKE ? 
    OR product.description LIKE ? 
    OR brand.brandName LIKE ? 
    OR category.name LIKE ? 
    OR subcategory.name LIKE ?;
    `;

    db.query(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, result) => {
        if (err) {
            console.error('Error searching products:', err);
            return res.status(500).send('Error searching products');
        }

        db.query(sqlCompany, (error, companyResult) => {
            if (error) {
                console.error('Database query error:', error.message);
                return res.status(500).send('Error retrieving company table');
            }
            res.render('customer/search', {
                company: companyResult,
                search: result
            });
        });
    });
};



//Get Index
exports.getIndex= (req, res)=>{
    const sqlCompany= `SELECT * FROM company`;
    const sqlProduct= `SELECT * FROM product`;

    //Company query
    db.query(sqlCompany, (error, companyResult)=>{
        if(error){
            console.error('Database query error', error.message)
            return res.status(500).send('Error Retreiving company table');
        }

        db.query(sqlProduct, (error, productResult)=>{
            if(error){
                console.error('Database query error', error.message)
                return res.status(500).send('Error Retreiving product table');
            }
            res.render('customer/index', {
                company: companyResult,
                product: productResult
            });
        });
    });
}

//Get Login
exports.getLogin= (req, res)=>{
    res.render('customer/login', {
        messages: req.flash('success'),
        errors: req.flash('error')
    });
};
//Post Login
exports.postLogin = (req, res) => {
    const { usernameORemail, password } = req.body;
    console.log("Login attempt for:", usernameORemail); // Debug log

    const sql = `SELECT * FROM user WHERE (username = ? OR email = ?) AND password = SHA1(?)`;

    db.query(sql, [usernameORemail, usernameORemail, password], (err, result) => {
        if (err) {
            console.error("Login error:", err); // Debug log
            throw err;
        }
        if (result.length > 0) {
            req.session.user = result[0];
            console.log("Session after login:", req.session); // Debug log
            req.flash('success', 'Login successful');

            if (req.session.user.role === 'admin') {
                res.redirect('/admin');
            } else {
                res.redirect('/');
            }
        } else {
            req.flash('error', 'Invalid email/Password');
            res.redirect('/login');
        }
    });
};

//Get Register
exports.getRegister = (req, res) => {
    res.render('customer/register', { 
        formData: req.body, 
        messages: req.flash('error'),
        successMessage: req.flash('success')
    });
};


//Post Register
exports.postRegister = (req, res) => {
    const { username, fullName, email, phoneNumber, password } = req.body;
    let image = req.body.image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = "default.png";
    }
    console.log(`Username: ${username}, Name: ${fullName}, Email: ${email}, Phone: ${phoneNumber}, Password: ${password}`);
    const checkUsernameSql = 'SELECT * FROM user WHERE username = ?';

    db.query(checkUsernameSql, [username], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error checking username');
            return res.redirect('/register');
        }

        if (result.length > 0) {
            req.flash('error', 'Username already taken. Please choose a different one.');
            return res.redirect('/register');
        }

        const sql = 'INSERT INTO user (username, fullName, email, phoneNumber, password, image, role) VALUES(?, ?, ?, ?, SHA1(?), ?, "user");';

        db.query(sql, [username, fullName, email, phoneNumber, password, image], (err) => {
            if (err) {
                console.error(err);
                req.flash('error', 'Error registering user');
                return res.redirect('/register');
            }
            req.flash('success', 'Registration successful! Please Login.');
            res.redirect('/login');
        });
    });
};

exports.getProfile = (req, res) => {
    console.log("Profile access - Session:", req.session); 
    
    if (!req.session.user) {
        console.log("No user in session");
        req.flash('error', 'Please log in to view your profile');
        return res.redirect('/login');
    }

    const userId = req.session.user.UserID;
    console.log("User ID from session:", userId);

    const sqlUser = `SELECT * FROM user WHERE UserID = ?`;
    const sqlCompany = `SELECT * FROM company`;

    // First get user data
    db.query(sqlUser, [userId], (userError, userResult) => {
        if (userError) {
            console.error('User query error:', userError);
            req.flash('errorP', 'Database error occurred');
            return res.redirect('/');
        }

        if (!userResult || userResult.length === 0) {
            console.log("No user found for ID:", userId);
            req.flash('errorP', 'User not found');
            return res.redirect('/login');
        }

        // Then get company data
        db.query(sqlCompany, (companyError, companyResult) => {
            if (companyError) {
                console.error('Company query error:', companyError);
                req.flash('errorP', 'Database error occurred');
                return res.redirect('/');
            }

            res.render('customer/profile', {
                company: companyResult,
                user: userResult[0],
                profileMessages: req.flash('errorP'),
                profileSuccessMessage: req.flash('successP'),
            });
        });
    });
};

exports.postProfile = (req, res) => {
    console.log("Update attempt - Session:", req.session); // Debug log
    
    if (!req.session.user) {
        console.log("No session during update"); // Debug log
        req.flash('errorP', 'Please log in to update your profile');
        return res.redirect('/login');
    }

    const userId = req.session.user.UserID;
    console.log("Updating user ID:", userId); // Debug log

    const { username, name, email, phone, password } = req.body;
    console.log("Update data:", { username, name, email, phone }); // Debug log (don't log password)
    
    let image = req.file ? req.file.filename : req.body.current;

    // Check for duplicate username
    const sqlDuplicate = 'SELECT * FROM user WHERE UserID != ? AND username = ?';
    
    db.query(sqlDuplicate, [userId, username], (duplicateErr, duplicateResult) => {
        if (duplicateErr) {
            console.error('Duplicate check error:', duplicateErr);
            req.flash('errorP', 'Database error occurred');
            return res.redirect('/profile');
        }

        if (duplicateResult.length > 0) {
            req.flash('errorP', 'Username already exists');
            return res.redirect('/profile');
        }

        // Update profile
        const sqlUpdate = `
            UPDATE user 
            SET username = ?, 
                email = ?, 
                password = SHA1(?), 
                phoneNumber = ?, 
                fullName = ?, 
                image = ? 
            WHERE UserID = ?`;

        db.query(sqlUpdate, 
            [username, email, password, phone, name, image, userId], 
            (updateErr, updateResult) => {
                if (updateErr) {
                    console.error("Update Error:", updateErr);
                    req.flash('errorP', "Failed to update profile");
                    return res.redirect('/profile');
                }

                // Update the session with new user data
                const sqlGetUpdated = 'SELECT * FROM user WHERE UserID = ?';
                db.query(sqlGetUpdated, [userId], (err, result) => {
                    if (!err && result.length > 0) {
                        req.session.user = result[0];
                        console.log("Session updated with new user data");
                    }
                    
                    req.flash('successP', "Profile updated successfully");
                    res.redirect('/profile');
                });
            }
        );
    });
};




exports.logout= (req, res)=>{
    req.session.destroy((err)=>{
        if (err) {
            return res.status(500).send("Failed to log out.");
          }
          res.redirect('/'); 
    })
}