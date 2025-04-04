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

//Get Category
exports.getCategory= (req, res)=>{
    const sqlCompany= `SELECT * FROM company`;
    const sqlCategory= `SELECT * FROM category`;

    //Company query
    db.query(sqlCompany, (error, companyResult)=>{
        if(error){
            console.error('Database query error', error.message)
            return res.status(500).send('Error Retreiving company table');
        }

        db.query(sqlCategory, (error, categoryresult)=>{
            if(error){
                console.error('Database query error', error.message)
                return res.status(500).send('Error Retreiving category table');
            }
            res.render('customer/categories', {
                company: companyResult,
                category: categoryresult
            });
        });
    });
}

// Get Admin User Page
exports.getAdminCategory = (req, res) => {
    const sqlCategory = `SELECT * FROM category`;
    db.query(sqlCategory, (err, categoryResult) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("Error retrieving category table.");
        }

        const sqlCompany = `SELECT * FROM company`;
        db.query(sqlCompany, (error, companyResult) => {
            if (error) {
                console.error("Database query error:", error.message);
                return res.status(500).send("Error retrieving company table.");
            }

            res.render('admin/adminCategory', {
                categoryList: categoryResult,
                company: companyResult,
            });
        });
    });
};

//Delete Category
exports.deleteCategory = (req, res) => {
    const categoryID = req.params.categoryID; 

    const sqlDelete = `DELETE FROM category WHERE categoryID = ?`;

    db.query(sqlDelete, [categoryID], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err.message);
            return res.status(500).send("Error deleting user.");
        }
        console.log(`Category with ID ${categoryID} deleted successfully.`);
        res.redirect('/adminCategory');
    });
};


//Get Add Category page
exports.getAddCategory = (req, res) => {
    const sqlCompany = `SELECT * FROM company`;
    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("Error retrieving company table.");
        }
        res.render('admin/addCategory', {
            company: companyResult,
        });
    });
};

//Add Category
exports.addCategory= (req, res)=>{
    const {name, description}= req.body;
    let image= req.body.image;
    if (req.file){
        image= req.file.filename;
    }

    const sql= `INSERT INTO category (name, description, image) VALUES( ?, ?, ?);`

    db.query(sql, [name, description, image], (err) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error registering category');
            return res.redirect('/addCategory');
        }
        req.flash('success', 'Registration successful!.');
        res.redirect('/adminCategory');
    });
}

exports.getEditCategory = (req, res) => {
    const categoryID = req.params.id;
    const sqlCompany = `SELECT * FROM company`;

    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error("Database query error (company):", err.message);
            return res.status(500).send("Error retrieving company table.");
        }

        const sqlCategory = `SELECT * FROM category WHERE categoryID = ?`;

        db.query(sqlCategory, [categoryID], (err, categoryResult) => { 
            if (err) {
                console.error("Database query error (category):", err.message);
                return res.status(500).send("Error retrieving category table.");
            }

            // Render the page with both query results
            res.render('admin/editCategory', {
                company: companyResult,
                category: categoryResult,
            });
        });
    });
};


//Edit Category
exports.editCategory= (req, res)=>{
    const CategoryID= req.params.id;
    const {name, description}= req.body;
    let image= req.body.currentImage;
    if (req.file){
        image= req.file.filename
    }

    const sql= 'UPDATE category SET name= ?, description= ?, image= ? WHERE categoryID= ?;';
    db.query(sql, [name, description, image, CategoryID], (err, result)=>{
        if (err) {
            console.error('Error updating category:', error.message);
            return res.status(500).send('Error updating category');
        } else {
            res.redirect('/adminCategory');
        }
    });
};

