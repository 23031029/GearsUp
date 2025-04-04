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

exports.getHistory = (req, res) => {
    const user = req.session.user;
    if (!user) {
        console.log('No user found in session');
        return res.redirect('/login');
    }

    const userID = user.UserID;
    const sql = `
    SELECT ol.*,
    DATE_FORMAT(ol.updatedDate, '%M %D %Y') as updatedDate,
        p.productID AS productID,
        p.name AS name, 
        p.image AS image, 
        c.colorName AS colorName, 
        s.size AS size, 
        (ol.quantity * p.price) AS total
        FROM orderlist AS ol
        LEFT JOIN product AS p ON ol.productID = p.productID
        LEFT JOIN product_variant AS v ON ol.variantID = v.productVariantID
        LEFT JOIN color AS c ON v.colorID = c.colorID
        LEFT JOIN size AS s ON v.sizeID = s.sizeID
        WHERE userID = ?
        ORDER BY ol.updatedDate DESC;
    `;

    db.query(sql, [userID], (error, result) => {
        if (error) {
            console.error('Error fetching order history:', error);
            return res.status(500).send('Error fetching order history');
        }

        // If no orders found, fetch company data and render the page
        if (!result.length) {
            const sqlCompany = "SELECT * FROM company";
            db.query(sqlCompany, (err, companyResult) => {
                if (err) {
                    console.error('Error fetching company data:', err);
                    return res.status(500).send('Error fetching company data');
                }
                return res.render('customer/history', { 
                    order: [], 
                    company: companyResult 
                });
            });
            return;
        }

        // If orders exist, fetch reviews
        const orderIds = result.map(order => order.productID);
        const sqlReviews = `
            SELECT r.productID, r.description, date_format(r.reviewDate, '%d %M % %Y ') as reviewDate, r.rating, r.image
            FROM reviews AS r
            JOIN user AS u ON r.userID = u.userID
            WHERE r.productID IN (?) and r.userID=?;
        `;

        db.query(sqlReviews, [orderIds, userID], (err, reviews) => {
            if (err) {
                console.error('Error fetching reviews:', err);
                return res.status(500).send('Error fetching reviews');
            }

            // Attach reviews to each order
            result.forEach(order => {
                order.reviews = reviews.filter(review => 
                    review.productID === order.productID
                );
            });

            // Fetch company data
            const sqlCompany = "SELECT * FROM company";
            db.query(sqlCompany, (err, companyResult) => {
                if (err) {
                    console.error('Error fetching company data:', err);
                    return res.status(500).send('Error fetching company data');
                }
                res.render('customer/history', { 
                    order: result, 
                    company: companyResult 
                });
            });
        });
    });
};



exports.getAdminOrder= (req, res) => {
    const sqlCompany = "SELECT * FROM company";
    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error('Error fetching company data:', err);
            return res.status(500).send('Error fetching company data');
        }

        const sqlOrder = `SELECT 
        ol.*,
        DATE_FORMAT(ol.updatedDate, '%M %D %Y') as updatedDate,
        p.productID AS productID,
       p.name AS name, 
       p.image AS image, 
       c.colorName AS colorName, 
       s.size AS size, 
       u.username,
       (ol.quantity * p.price) AS total
        FROM orderlist AS ol
        LEFT JOIN product AS p ON ol.productID = p.productID
        LEFT JOIN product_variant AS v ON ol.variantID = v.productVariantID
        LEFT JOIN color AS c ON v.colorID = c.colorID
        LEFT JOIN size AS s ON v.sizeID = s.sizeID
        JOIN user as u ON ol.userID= u.UserID
        ORDER BY ol.userID, ol.updatedDate DESC;`;
        db.query(sqlOrder, (error, orderResult) => {
            if (error) {
                console.error('Error fetching order data:', error);
                return res.status(500).send('Error fetching order data');
            }

            res.render('admin/adminOrder', { order: orderResult, company: companyResult });
        });
    });
};  

exports.updateStatus = (req, res) => {
    const orderID = req.params.id;
    console.log('orderID:', orderID);
    const status = req.body.status;
    const sql = "UPDATE orderlist SET status = ? WHERE orderItemId = ?";
    db.query(sql, [status, orderID], (error, result) => {
        if (error) {
            console.error('Error updating order status:', error.message);
            return res.status(500).send('Error updating order status');
        }

        res.redirect('/adminOrder');
        
    });
}