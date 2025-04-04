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

exports.getProduct= (req,res)=>{
    const categoryID= req.params.id;
    const sqlProduct="SELECT * FROM product WHERE categoryID= ?"
    const sqlCompany='SELECT * FROM company';
    const sqlSub= 'SELECT * FROM subcategory WHERE categoryID=?'
    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error('Database query error (company):', err.message);
            return res.status(500).send('Error retrieving company data.');
        }

        db.query(sqlProduct, [categoryID],(err, productResult) => {
            if (err) {
                console.error('Database query error (product):', err.message);
                return res.status(500).send('Error retrieving product data.');
            }
           db.query(sqlSub,[categoryID], (err,subResult)=>{
            if(err){
                console.error('Database query error (company):', err.message);
            return res.status(500).send('Error retrieving company data.');
            }

            res.render('customer/product', {
                company: companyResult,
                product: productResult,
                subcategories:subResult
            });
           })
        });
    });
}

exports.getProductID = (req, res) => {
    const productID = req.params.productID;

    const sqlCompany = 'SELECT * FROM company';
    const sqlProduct = `
        SELECT 
            product.*,
            brand.brandName
        FROM 
            product
        LEFT JOIN 
            brand ON product.brand = brand.brandID
        WHERE 
            product.productID = ?
    `;

    const sqlVariant = `SELECT pv.productVariantID, pv.sizeID, pv.productID, pv.colorID, color.colorName, size.size, pv.quantity
    FROM product_variant as pv
    LEFT JOIN color ON color.colorID= pv.colorID
    LEFT JOIN size ON size.sizeID= pv.sizeID
    WHERE pv.productID= ?
    `;

    // Fetch company data
    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error('Database query error (company):', err.message);
            return res.status(500).send('Error retrieving company data.');
        }

        // Fetch product data
        db.query(sqlProduct, [productID], (err, productResult) => {
            if (err) {
                console.error('Database query error (product):', err.message);
                return res.status(500).send('Error retrieving product data.');
            }

            // If no product is found, handle the error
            if (productResult.length === 0) {
                return res.status(404).send('Product not found.');
            }

            const product = productResult[0]; // Get the first product from the array

            // Fetch variant data
            db.query(sqlVariant, [productID], (err, variantResult) => {
                if (err) {
                    console.error('Database query error (variant):', err.message);
                    return res.status(500).send('Error retrieving variant data.');
                }

                const sqlReview = `SELECT 
    u.username, 
    p.name, 
    c.colorName, 
    s.size, 
    r.description, 
    r.rating, 
    DATE_FORMAT(r.reviewDate, '%d %M %Y') AS reviewDate, 
    r.image
FROM reviews AS r
JOIN product AS p ON p.productID = r.productID
JOIN product_variant AS v ON r.variantID = v.productVariantID
LEFT JOIN size AS s ON v.sizeID = s.sizeID
LEFT JOIN color AS c ON c.colorID = v.colorID
JOIN user AS u ON u.UserID = r.userID
WHERE r.productID = ?
;

                `;
                db.query(sqlReview, [productID], (err, reviewResult) => {
                    if (err) {
                        console.error('Database query error (review):', err.message);
                        return res.status(500).send('Error retrieving review data.');
                    }

                    res.render('customer/productID', {
                        company: companyResult,
                        product: product,
                        variant: variantResult,
                        feedback: reviewResult
                    });
                });
            });
        });
    });
};





exports.getAdminProduct = (req, res) => {
    const sqlCompany = 'SELECT * FROM company';
    const sqlProduct = `
        SELECT p.*, b.brandName, 
               cat.name AS categoryName, subcat.name AS subCategoryName, 
               DATE_FORMAT(p.addedDate, '%b %d, %Y') AS formattedAddedDate
        FROM product AS p
        LEFT JOIN brand AS b ON b.brandID = p.brand
        LEFT JOIN category AS cat ON cat.categoryID = p.categoryID
        LEFT JOIN subcategory AS subcat ON subcat.subCategoryID = p.subCategoryID
    `;

    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error('Database query error (company):', err.message);
            return res.status(500).send('Error retrieving company data.');
        }

        db.query(sqlProduct, (err, productResult) => {
            if (err) {
                console.error('Database query error (product):', err.message);
                return res.status(500).send('Error retrieving product data.');
            }
            
            const sqlVariant = `
                SELECT variant.*, size.size, color.colorName 
                FROM product_variant AS variant
                LEFT JOIN size ON size.sizeID = variant.sizeID
                LEFT JOIN color ON color.colorID = variant.colorID
            `;

            db.query(sqlVariant, (err, variantResult) => {
                if (err) {
                    console.error('Database query error (variant):', err.message);
                    return res.status(500).send('Error retrieving variant data.');
                }

 
                res.render('admin/adminProduct', {
                    company: companyResult,
                    product: productResult,
                    variant: variantResult
                });
            });
        });
    });
};


exports.getAddProduct = (req, res) => {
    const sqlCompany = 'SELECT * FROM company';
    const sqlBrand = 'SELECT * FROM brand';
    const sqlCategory = 'SELECT * FROM category';
    const sqlSubCat = 'SELECT * FROM subcategory';

    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error('Database query error (company):', err.message);
            return res.status(500).send('Error retrieving company data.');
        }

                db.query(sqlBrand, (err, brandResult) => {
                    if (err) {
                        console.error('Database query error (brand):', err.message);
                        return res.status(500).send('Error retrieving brand data.');
                    }

                    db.query(sqlCategory, (err, categoryResult) => {
                        if (err) {
                            console.error('Database query error (category):', err.message);
                            return res.status(500).send('Error retrieving category data.');
                        }

                        db.query(sqlSubCat, (err, subCatResult) => {
                            if (err) {
                                console.error('Database query error (subcategory):', err.message);
                                return res.status(500).send('Error retrieving subcategory data.');
                            }

                            res.render('admin/addProduct', {
                                company: companyResult,
                                brand: brandResult,
                                category: categoryResult,
                                subcategory: subCatResult,
                            });
                        });
            });
        });
    });
};


exports.addProduct = (req, res) => {
    const { name, description, price, discount, brand, category, subcategory } = req.body;
    let image = req.body.image;
    if (req.file) {
        image = req.file.filename;
    }

    const sqlProduct = `INSERT INTO product (name, description, price, discount, categoryID, subCategoryID, brand, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sqlProduct, [name, description, price, discount,  category, subcategory, brand, image], (err, productResult) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error registering product');
            return;
        }
            req.flash('success', 'Registration successful!.');
            res.redirect('/adminProduct');
    });
}





exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    console.log("Attempting to delete product:", productId); // Debug log

    if (!productId) {
        console.log("No product ID provided"); // Debug log
        return res.status(400).json({ message: "Product ID is required" });
    }

    // First, delete related records from product_variant
    const deleteVariantsQuery = 'DELETE FROM product_variant WHERE productID = ?';
    
    db.query(deleteVariantsQuery, [productId], (variantErr, variantResult) => {
        if (variantErr) {
            console.error("Error deleting variants:", variantErr); // Debug log
            return res.status(500).json({ 
                message: "Failed to delete product variants", 
                error: variantErr 
            });
        }

        // Then, delete the product
        const deleteProductQuery = 'DELETE FROM product WHERE productID = ?';
        
        db.query(deleteProductQuery, [productId], (err, result) => {
            if (err) {
                console.error("Error deleting product:", err); // Debug log
                return res.status(500).json({ 
                    message: "Failed to delete product", 
                    error: err 
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    message: "Product not found" 
                });
            }

            console.log("Product deleted successfully:", productId); // Debug log
            res.redirect('/adminProduct'); // Fixed missing closing quote
        });
    });
};

exports.getAddVariant = (req, res) => {
    const sqlCompany = `SELECT * FROM COMPANY`;
    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error('Database query error (company):', err.message);
            return res.status(500).send('Error retrieving company data.');
        }

        const sqlProduct = `SELECT product.name, product.productID FROM PRODUCT`;
        db.query(sqlProduct, (err, productResult) => {
            if (err) {
                console.error('Database query error (product):', err.message);
                return res.status(500).send('Error retrieving product data.');
            }

            const sqlSize = `SELECT * FROM size`;
            db.query(sqlSize, (err, sizeResult) => {
                if (err) {
                    console.error('Database query error (size):', err.message);
                    return res.status(500).send('Error retrieving size data.');
                }

                const sqlColor = `SELECT * FROM color`;
                db.query(sqlColor, (err, colorResult) => {
                    if (err) {
                        console.error('Database query error (color):', err.message);
                        return res.status(500).send('Error retrieving color data.');
                    }

                    res.render('admin/addVariant', {
                        company: companyResult,
                        product: productResult,
                        size: sizeResult,
                        color: colorResult
                    });
                });
            });
        });
    });
};

exports.addVariant = (req, res) => {
    let { product, size, color, quantity } = req.body;

    // Handle empty values by setting them to null
    if (size === "") {
        size = null;
    }

    if (color === "") {
        color = null;
    }

    const sqlAdd = `INSERT INTO product_variant (productID, sizeID, colorID, quantity)
                    VALUES(?, ?, ?, ?)`;

    db.query(sqlAdd, [product, size, color, quantity], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error registering variant');
            return res.redirect('/adminProduct');  // Optionally, you can redirect to the product variant page
        }

        req.flash('success', 'Variant registration successful!');
        res.redirect('/adminProduct'); // Redirect to product page after successful addition
    });
}


exports.getEditProduct = (req, res) => {
    const productID = req.params.id;

    // Fetch product details along with related data
    const sqlProduct = `
        SELECT 
            product.*, 
            category.name AS category, 
            subcategory.name AS subcategory, 
            brand.brandName AS brandName
        FROM product 
        LEFT JOIN category ON category.categoryID = product.categoryID
        LEFT JOIN subcategory ON subcategory.subCategoryID = product.subCategoryID
        LEFT JOIN brand ON brand.brandID = product.brand
        WHERE productID = ?
    `;

    db.query(sqlProduct, [productID], (err, productResult) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.redirect("/adminProduct");
        }

        if (productResult.length === 0) {
            console.log("No product found with ID:", productID);
            return res.redirect("/adminProduct");
        }

        // Fetch additional data needed for the form
        const sqlCompany = 'SELECT * FROM company';
        const sqlCategory = 'SELECT name, categoryID FROM category';
        const sqlSubCategory = 'SELECT subCategoryID, name FROM subcategory';
        const sqlBrand = 'SELECT brandName, brandID FROM brand';

        // Execute the queries to fetch the data
        db.query(sqlCompany, (err, companyResult) => {
            if (err) {
                console.error("Error fetching companies:", err);
                return res.redirect("/adminProduct");
            }

            db.query(sqlCategory, (err, categoryResult) => {
                if (err) {
                    console.error("Error fetching categories:", err);
                    return res.redirect("/adminProduct");
                }

                db.query(sqlSubCategory, (err, subCategoryResult) => {
                    if (err) {
                        console.error("Error fetching subcategories:", err);
                        return res.redirect("/adminProduct");
                    }

                    db.query(sqlBrand, (err, brandResult) => {
                        if (err) {
                            console.error("Error fetching brands:", err);
                            return res.redirect("/adminProduct");
                        }

                        // Render the page after all queries are successful
                        res.render("admin/editProduct", {
                            product: productResult,
                            company: companyResult,
                            brand: brandResult,
                            category: categoryResult,
                            subcat: subCategoryResult
                        });
                    });
                });
            });
        });
    });
};


exports.editProduct = (req, res) => {
    const productID = req.params.id;
    const { name, brand, category, subcategory, description, price, discount } = req.body;
    let image = req.body.current;

    // Check if a new image was uploaded
    if (req.file) {
        image = req.file.filename;
    }

    // Update product details in the database
    const sqlUpdate = `
        UPDATE product 
        SET name = ?, brand = ?, categoryID = ?, subCategoryID = ?, 
            price = ?, discount = ?, image = ?, description = ?, addedDate = NOW()
        WHERE productID = ?
    `;

    db.query(sqlUpdate, [name, brand, category, subcategory, price, discount, image, description, productID], (err) => {
        if (err) {
            console.error("Error updating product:", err);
            return res.status(500).send("Error updating product");
        }

        // If successful, redirect to the admin product page
        res.redirect('/adminProduct');
    });
};

exports.deleteVariant = (req, res) => {
    const variantID = req.params.id; // Corrected this line to use req.params.id
    const sql = `DELETE FROM product_variant WHERE productVariantID = ?`; // Added 'FROM' before table name

    db.query(sql, [variantID], (err) => {
        if (err) {
            console.error("Error deleting variant:", err);
            return res.status(500).send("Error deleting variant");
        }

        // If successful, redirect to the admin product page
        res.redirect('/adminProduct');
    });
};

exports.editVariant= (req,res)=>{
    const {quantity}= req.body;
    variantID= req.params.id
    const updateSQL= "UPDATE product_variant SET quantity=? WHERE productVariantID=? "
    db.query(updateSQL, [quantity, variantID], (err, result)=>{
        if (err) {
            console.error("Error updating product:", err);
            return res.status(500).send("Error updating quantity");
        }

        res.redirect('/adminProduct');
    })
}