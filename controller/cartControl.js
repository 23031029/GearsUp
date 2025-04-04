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
exports.addtocart = (req, res) => {
    const user = req.session.user;

    // Check if user is logged in
    if (!user || !user.UserID) {
        console.log('No user found in session');
        return res.redirect('/login');
    }

    let { productID, variant, quantity } = req.body;
    const userID = user.UserID; // Access UserID only after checking

    // First, check if the product with the same variant already exists in the cart for the user
    const checkSql = `SELECT * FROM cart WHERE productID = ? AND productVariantID = ? AND userID = ?`;

    db.query(checkSql, [productID, variant, userID], (error, result) => {
        if (error) {
            console.error('Error checking cart:', error.message);
            return res.status(500).send('Error checking cart');
        }

        if (result.length > 0) {
            // Product exists in the cart, update the quantity
            const newQuantity = parseInt(result[0].quantity) + parseInt(quantity);

            const updateSql = `UPDATE cart SET quantity = ? WHERE productID = ? AND productVariantID = ? AND userID = ?`;

            db.query(updateSql, [newQuantity, productID, variant, userID], (updateError, updateResult) => {
                if (updateError) {
                    console.error('Error updating cart:', updateError.message);
                    return res.status(500).send('Error updating cart');
                }

                res.redirect('/cart'); // Redirect to the cart page
            });
        } else {
            // Product does not exist in the cart, insert a new record
            const insertSql = `INSERT INTO cart (productID, productVariantID, userID, quantity) VALUES (?, ?, ?, ?)`;

            db.query(insertSql, [productID, variant, userID, quantity], (insertError, insertResult) => {
                if (insertError) {
                    console.error('Error adding to cart:', insertError.message);
                    return res.status(500).send('Error adding to cart');
                }

                res.redirect('/cart'); // Redirect to the cart page
            });
        }
    });
};


    

exports.getCart = (req, res) => {
    const user = req.session.user;
    if (!user) {
        console.log('No user found in session');
        return res.redirect('/login');
    }

    const userId = user.UserID;
    console.log('Fetching cart for user:', userId);

    const sqlCompany = "SELECT * FROM company";
    
    const sqlCart = `
        SELECT 
            p.productID,
            pv.colorID, 
            pv.sizeID,
            p.image, 
            p.name, 
            p.price, 
            cart.cartID, 
            u.UserID, 
            c.colorName, 
            s.size,
            cart.quantity,
            (cart.quantity*p.price) as total
        FROM cart 
        LEFT JOIN product_variant as pv ON pv.productVariantID = cart.productVariantID
        LEFT JOIN product as p ON p.productID = cart.productID
        LEFT JOIN user as u ON u.UserID = cart.userID
        LEFT JOIN color as c ON c.colorID = pv.colorID
        LEFT JOIN size as s ON s.sizeID = pv.sizeID
        WHERE cart.userID = ?
    `;

    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error('Error fetching company data:', err);
            return res.status(500).send('Error fetching company data');
        }
        db.query(sqlCart, [userId], (err, cartResult) => {
            if (err) {
                console.error('Error fetching cart data:', err);
                return res.status(500).send('Error fetching cart data');
            }

            console.log('Cart and company data fetched for user:', userId);

            // Calculate total payment
            let totalPayment = 0;
            cartResult.forEach(item => {
                totalPayment += item.price * item.quantity;  
            });

            res.render('customer/cart', {
                cart: cartResult,
                company: companyResult,
                total_payment: totalPayment.toFixed(2)
            });
        });
    });
};

exports.editCart = (req, res) => {
    const { quantity } = req.body;
    const cartID = req.params.cartID;
    const sqlEdit = 'UPDATE cart SET quantity = ? WHERE cartID = ?';

    console.log('Quantity:', quantity);
    console.log('Cart ID:', cartID);

    db.query(sqlEdit, [quantity, cartID], (error, results) => {
        if (error) {
            console.error('Database update error:', error.message);
            return res.status(500).send('Error updating quantity');
        }
        
        res.redirect('/cart')
    });
};


exports.deleteCart = (req, res) => {
    const cartID = req.params.cartID;
    const sqlDeleteCart = `DELETE FROM cart WHERE cartID = ?`;

    db.query(sqlDeleteCart, [cartID], (error, result) => {
        if (error) {
            console.error('Error deleting cart item:', error.message);
            return res.status(500).send('Error deleting cart item');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Cart item not found');
        }
        res.redirect('/cart');
    })
};

exports.checkout = (req, res) => {
    const { paymentMethod, orderId, transactionId } = req.params;
    const user = req.session.user;
    const userID = user.UserID; // Assuming userID is available in req.user
    console.log(`order ID: ${orderId} transaction ID: ${transactionId} userID: ${userID}`);
    
    const sqlCompany = "SELECT * FROM company";
    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error('Error fetching company data:', err);
            return res.status(500).send('Error fetching company data');
        }

        const sql = `SELECT 
        p.productID, p.name, p.image, p.price, cart.quantity as cartQuantity, pv.productVariantID, c.colorName, s.size
        FROM product as p
        JOIN cart ON p.productID = cart.productID
        JOIN product_variant as pv ON pv.productVariantID = cart.productVariantID
        LEFT JOIN color as c ON c.colorID = pv.colorID
        LEFT JOIN size as s ON s.sizeID = pv.sizeID
        WHERE cart.userID = ?`;
        db.query(sql, [userID], (err, cartResult) => {
            if (err) {
                console.error('Error fetching cart data:', err);
                return res.status(500).send('Error fetching cart data');
            }
            console.log('Cart Data: ', cartResult);

            if (cartResult.length > 0) {
                let totalAmount = 0;

                // Calculate total payment
                cartResult.forEach(item => {
                    totalAmount += item.price * item.cartQuantity;
                });

                // Insert order
                const orderSQL = `INSERT INTO orderlist
                (productID, variantID, userID, quantity, paymentMethod, updatedDate, orderId, transactionId) 
                VALUES (?,?,?,?,?, ?, ?, ?)`;
                const updatedDate = new Date();
                cartResult.forEach(orderItem => {
                    console.log('Order Item:', orderItem);
                    db.query(orderSQL,
                        [orderItem.productID, orderItem.productVariantID, userID, orderItem.cartQuantity, paymentMethod, updatedDate, orderId, transactionId], (error, result) => {
                            if (error) {
                                console.error('Error adding order:', error.message);
                                return res.status(500).send('Error adding order');
                            }
                        });
                });

                const clearCartsql = `DELETE FROM cart WHERE userID = ?`;
                db.query(clearCartsql, [userID], (error, result) => {
                    if (error) {
                        console.error('Error clearing cart:', error.message);
                        return res.status(500).send('Error clearing cart');
                    }
                });

                res.render('customer/invoice', {
                    cart: cartResult,
                    total_payment: totalAmount.toFixed(2),
                    userId: userID,
                    orderDate: updatedDate,
                    paymentMethod: paymentMethod,
                    orderId: orderId,
                    transactionId: transactionId,
                    company: companyResult
                });
            }
        });
    });
}