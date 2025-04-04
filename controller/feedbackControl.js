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

exports.getAddFeedback = (req, res) => {
    const productId = req.params.productId;
    const user= req.session.user;
    const userID = user.UserID;
    const sql = `SELECT p.name, s.size, c.colorName, p.productID, v.productVariantID
    FROM orderlist ol
    JOIN product p ON ol.productID = p.productID 
    JOIN product_variant v ON ol.variantID = v.productVariantID
    LEFT JOIN size s ON v.sizeID = s.sizeID
    LEFT JOIN color c ON v.colorID = c.colorID
    WHERE ol.productID=? AND ol.userID=?`;
    db.query(sql, [productId, userID], (err, result) => {
        if (err) {
            console.log(err);
            return res.redirect('/history');
        }
        if (result.length === 0) {
            return res.redirect('/history');
        }

        const sqlCompany = `SELECT * FROM company`;
        db.query(sqlCompany, (err, resultCompany) => {
            if (err) {
                console.log(err);
                return res.redirect('/history');
            }

            res.render('customer/addReview', { 
                product: result[0], 
                company: resultCompany
            });
        });
    });
};

exports.postAddFeedback = (req, res) => {
    const productid = req.params.productId;
    const user = req.session.user;
    const userID = user.UserID;
    const { productID, variantID, rate, description } = req.body;
    
    let image = null;
    if (req.file) {
        image = req.file.filename;
    }

    const sql = `INSERT INTO reviews(productID, userID, variantID, rating, image, description, reviewDate)
                 VALUES(?, ?, ?, ?, ?, ?, NOW())`;

    db.query(sql, [productID, userID, variantID, rate, image, description], (err, result) => {
        if (err) {
            console.log(err);
            return res.redirect('/history');
        }
        return res.redirect('/history');
    });
};

