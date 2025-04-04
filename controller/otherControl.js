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

//Admin brand
exports.adminbrand= (req,res)=>{
    const sqlCompany= `SELECT * FROM company`;
    const sqlBrand= `SELECT * FROM brand`;

    //Company query
    db.query(sqlCompany, (error, companyResult)=>{
        if(error){
            console.error('Database query error', error.message)
            return res.status(500).send('Error Retreiving company table');
        }

        db.query(sqlBrand, (error, brandResult)=>{
            if(error){
                console.error('Database query error', error.message)
                return res.status(500).send('Error Retreiving brand table');
            }
            res.render('admin/adminBrand', {
                company: companyResult,
                brand: brandResult
            });
        });
    });
};

//Add Brand
exports.getAddBrand= (req,res)=>{
    const sqlCompany = `SELECT * FROM company`;
    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("Error retrieving company table.");
        }
        res.render('admin/addBrand', {
            company: companyResult,
        });
    });
};

exports.postBrand= (req,res)=>{
    const {name, description}= req.body;
    let image= req.body.image;
    if (req.file){
        image= req.file.filename;
    }

    const sql= `INSERT INTO brand (brandName, description, BrandImage) VALUES( ?, ?, ?);`

    db.query(sql, [name, description, image], (err) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error registering brand');
            return res.redirect('/addBrand');
        }
        req.flash('success', 'Registration successful!.');
        res.redirect('/adminBrand');
    });
};

exports.getEditBrand = (req, res) => {
    const brandID = req.params.id;  // The ID passed in the URL
    const sqlCompany = `SELECT * FROM company`;

    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error("Database query error (company):", err.message);
            return res.status(500).send("Error retrieving company table.");
        }

        const sqlBrand = `SELECT * FROM brand WHERE brandID = ?`;

        db.query(sqlBrand, [brandID], (err, brandResult) => {
            if (err) {
                console.error("Database query error (brand):", err.message);
                return res.status(500).send("Error retrieving brand table.");
            }
        
            console.log("Brand Result:", brandResult); // Check what is returned here
        
            if (!brandResult || brandResult.length === 0) {
                return res.status(404).send("Brand not found.");
            }
        
            res.render('admin/editBrand', {
                company: companyResult,
                brand: brandResult[0],
            });
        }); 
    });
};

exports.editBrand=(req,res)=>{
    const brandID= req.params.id;
    const {name, description}= req.body;
    let image= req.body.currentImage;
    if (req.file){
        image= req.file.filename
    }

    const sql= 'UPDATE brand SET brandName= ?, description= ?, brandImage= ? WHERE brandID= ?;';
    db.query(sql, [name, description, image, brandID], (err, result)=>{
        if (err) {
            console.error('Error updating brand:', err.message);
            return res.status(500).send('Error updating brand');
        } else {
            res.redirect('/adminBrand');
        }
    });
};

exports.deleteBrand = (req, res) => {
    const brandID = req.params.id; 

    const sqlDelete = `DELETE FROM brand WHERE brandID = ?`;

    db.query(sqlDelete, [brandID], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err.message);
            return res.status(500).send("Error deleting brand.");
        }
        console.log(`Category with ID ${brandID} deleted successfully.`);
        res.redirect('/adminBrand');
    });
};

// Admin Color and Size
exports.adminSC = (req, res) => {
    const sqlCompany = `SELECT * FROM company`;
    const sqlColor = `SELECT * FROM color`;
    const sqlSize = `SELECT * FROM size`;

    // Company query
    db.query(sqlCompany, (error, companyResult) => {
        if (error) {
            console.error('Database query error', error.message);
            return res.status(500).send('Error Retrieving company table');
        }

        db.query(sqlColor, (error, colorResult) => {
            if (error) {
                console.error('Database query error', error.message);
                return res.status(500).send('Error Retrieving color table');
            }

            db.query(sqlSize, (error, sizeResult) => {
                if (error) {
                    console.error('Database query error', error.message);
                    return res.status(500).send('Error Retrieving size table');
                }

                res.render('admin/adminSC', {
                    company: companyResult,
                    color: colorResult,
                    size: sizeResult
                });
            });
        });
    });
};

//Color
exports.addColor=(req,res)=>{
    const colorName= req.body.colorName;
    const sql= "INSERT INTO color (colorName) VALUES(?);";
    db.query(sql, colorName, (err) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error registering color');
            return res.redirect('/adminSC');
        }
        req.flash('success', 'Registration successful!.');
        res.redirect('/adminSC');
    });
}

exports.deleteColor= (req,res)=>{
    const colorID = req.params.id; 

    const sqlDelete = `DELETE FROM color WHERE colorID = ?`;

    db.query(sqlDelete, [colorID], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err.message);
            return res.status(500).send("Error deleting color.");
        }
        console.log(`Category with ID ${colorID} deleted successfully.`);
        res.redirect('/adminSC');
    });
}

//Size
exports.addSize=(req,res)=>{
    const size= req.body.size;
    const sql= "INSERT INTO size (size) VALUES(?);";
    db.query(sql, size, (err) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error registering size');
            return res.redirect('/adminSC');
        }
        req.flash('success', 'Registration successful!.');
        res.redirect('/adminSC');
    });
}

exports.deleteSize= (req,res)=>{
    const sizeID = req.params.id; 

    const sqlDelete = `DELETE FROM size WHERE sizeID = ?`;

    db.query(sqlDelete, [sizeID], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err.message);
            return res.status(500).send("Error deleting size.");
        }
        console.log(`Category with ID ${sizeID} deleted successfully.`);
        res.redirect('/adminSC');
    });
}