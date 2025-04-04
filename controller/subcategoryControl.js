/*
 I declare that this code was written by me. 
 I will not copy or allow others to copy my code. 
 I understand that copying code is considered as plagiarism.
 
 Student Name: Toh Ser Jia
 Student ID: 23031029
 Class: C372-2D-E63C-A
 Date created: 10/02/2025
 */

const db = require('../db');

//Get subProduct
exports.getSubProduct = (req, res) => {
    const categoryID = req.params.categoryID;
    const subcategoryID = req.params.subcategoryID;

    const sqlCompany = "SELECT * FROM company";
    const sqlSubCategory = "SELECT name, subCategoryID FROM subcategory WHERE categoryID = ?";
    let sqlProduct = "SELECT product.name, product.price, product.image FROM product WHERE categoryID = ?"; // Query for all products by category

    if (subcategoryID) {
        sqlProduct = "SELECT product.name, product.price, product.image FROM product WHERE subcategoryID = ?";
    }

    db.query(sqlCompany, (error, companyResult) => {
        if (error) {
            console.error('Database query error (company):', error.message);
            return res.status(500).send('Error retrieving company table');
        }

        db.query(sqlSubCategory, [categoryID], (error, subCategoryResult) => {
            if (error) {
                console.error('Database query error (subcategory):', error.message);
                return res.status(500).send('Error retrieving subcategory table');
            }

            db.query(sqlProduct, [subcategoryID || categoryID], (error, productResult) => {
                if (error) {
                    console.error('Database query error (product):', error.message);
                    return res.status(500).send('Error retrieving product table');
                }

                res.render('customer/subProduct', {
                    company: companyResult,
                    subcategories: subCategoryResult,
                    product: productResult,
                    categoryID: categoryID
                });
            });
        });
    });
};

// //Sort by sub category
// exports.getSubProductsBySubcategory = (req, res) => {
//     const categoryID = req.params.categoryID;
//     const subcategoryID = req.params.subcategoryID;

//     const sqlCompany = "SELECT * FROM company";
//     const sqlSubCategory = "SELECT name, subCategoryID FROM subcategory WHERE categoryID = ?";
//     const sqlProduct = "SELECT * FROM product WHERE subcategoryID = ?";


//     db.query(sqlCompany, (error, companyResult) => {
//         if (error) {
//             console.error('Database query error (company):', error.message);
//             return res.status(500).send('Error retrieving company table');
//         }

//         db.query(sqlSubCategory, [categoryID], (error, subCategoryResult) => {
//             if (error) {
//                 console.error('Database query error (subcategory):', error.message);
//                 return res.status(500).send('Error retrieving subcategory table');
//             }

//             db.query(sqlProduct, [subcategoryID], (error, productResult) => {
//                 if (error) {
//                     console.error('Database query error (product):', error.message);
//                     return res.status(500).send('Error retrieving product table');
//                 }

//                 res.render('customer/subProduct', {
//                     company: companyResult,
//                     subcategories: subCategoryResult,
//                     product: productResult,
//                     categoryID: categoryID
//                 });
//             });
//         });
//     });
// };

exports.getSubProductsBySubcategory = (req, res) => {
    const categoryID = req.params.categoryID;
    const subcategoryID = req.params.subcategoryID;

    const sqlCompany = "SELECT * FROM company";
    const sqlSubCategory = "SELECT name, subCategoryID FROM subcategory WHERE categoryID = ?";
    const sqlProduct = "SELECT * FROM product WHERE subcategoryID = ?";

    db.query(sqlCompany, (error, companyResult) => {
        if (error) {
            console.error('Database query error (company):', error.message);
            return res.status(500).send('Error retrieving company table');
        }

        db.query(sqlSubCategory, [categoryID], (error, subCategoryResult) => {
            if (error) {
                console.error('Database query error (subcategory):', error.message);
                return res.status(500).send('Error retrieving subcategory table');
            }

            db.query(sqlProduct, [subcategoryID], (error, productResult) => {
                if (error) {
                    console.error('Database query error (product):', error.message);
                    return res.status(500).send('Error retrieving product table');
                }
                
                console.log('Product Data:', productResult);

                res.render('customer/subProduct', {
                    company: companyResult,
                    subcategories: subCategoryResult,
                    product: productResult,
                    categoryID: categoryID
                });
            });
        });
    });
};

//Get Admin Sub category list
exports.getAdminSubProdct= (req, res)=>{
    const sqlCompany = "SELECT * FROM company";
    const sqlSubCategory= `SELECT subcategory.*, category.name AS categoryName
                            FROM subcategory
                            JOIN category ON subcategory.categoryID = category.categoryID;
    `;
    
    db.query(sqlCompany, (error, companyResult) => {
        if (error) {
            console.error('Database query error (company):', error.message);
            return res.status(500).send('Error retrieving company table');
        }
        db.query(sqlSubCategory, (error, subCategoryResult) => {
            if (error) {
                console.error('Database query error (subcategory):', error.message);
                return res.status(500).send('Error retrieving subcategory table');
            }
            res.render('admin/adminSubCategory', {
                company: companyResult,
                subcategories: subCategoryResult
            });
        })
    })
}

//Get Add Sub category
exports.getAddSubCategoryPage = (req, res) => {
    const sqlCategory = "SELECT * FROM category";
    const sqlCompany = "SELECT * FROM company";
    db.query(sqlCategory, (error, categoriesResult) => {
        if (error) {
            console.error('Database query error (category):', error.message);
            return res.status(500).send('Error retrieving categories');
        }
        db.query(sqlCompany, (error, companyResult) => {
            if (error) {
                console.error('Database query error (company):', error.message);
                return res.status(500).send('Error retrieving company table');
            }
            

        res.render('admin/addSubCat', {
            categories: categoriesResult,
            company: companyResult
            });
        });
    });
};

//Add sub category
exports.addSubCategory= (req,res)=>{
    const {name, description, categoryID}= req.body
    const sql= "INSERT INTO subcategory(name, description, categoryID) VALUES(?, ?, ?);";
    db.query(sql, [name, description, categoryID], (err, result)=>{
        if (err){
            console.error('Database insert error:', err.message);
            return res.status(500).send('Error adding subcategory');
        }
        res.redirect('/adminSubCategory');
    });
};

//Delete Sub category
exports.deleteSub = (req, res) => {
    const subcatID = req.params.subCategoryID; 

    const sqlDelete = `DELETE FROM subcategory WHERE subcategoryID = ?`;

    db.query(sqlDelete, [subcatID], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err.message);
            return res.status(500).send("Error deleting user.");
        }
        console.log(`Sub Category with ID ${subcatID} deleted successfully.`);
        res.redirect('/adminSubCategory');
    });
};

//Get edit SubCat page
exports.getEditSubCat = (req, res) => {
    const subcatID = req.params.subCategoryID;
    const sqlCategory = "SELECT * FROM category";
    const sqlCompany = "SELECT * FROM company";
    const sqlSubCat = "SELECT * FROM subcategory WHERE subCategoryID = ?";

    db.query(sqlCategory, (error, categoriesResult) => {
        if (error) {
            console.error('Database query error (category):', error.message);
            return res.status(500).send('Error retrieving categories');
        }
        db.query(sqlCompany, (error, companyResult) => {
            if (error) {
                console.error('Database query error (company):', error.message);
                return res.status(500).send('Error retrieving company table');
            }
            db.query(sqlSubCat, [subcatID], (error, subCategoryResult) => {
                if (error) {
                    console.error('Database query error (subcategory):', error.message);
                    return res.status(500).send('Error retrieving subcategory');
                }
                res.render('admin/editSubCat', {
                    categories: categoriesResult,
                    company: companyResult,
                    subcategory: subCategoryResult[0] 
                });
            });
        });
    });
};

//Edit Sub Category
exports.editSubCat = (req, res) => {

    const subcatID = req.params.subCategoryID;
    const { name, Description, categoryID } = req.body;

    const sql = `
        UPDATE subcategory 
        SET name = ?, Description = ?, categoryID = ?
        WHERE subCategoryID = ?`;

    db.query(sql, [name, Description, categoryID, subcatID], (error, result) => {
        if (error) {
            console.error('Database update error:', error.message);
            return res.status(500).send('Error updating subcategory');
        }

        res.redirect('/adminSubCategory');
    });
};
