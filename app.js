/*
 I declare that this code was written by me. 
 I will not copy or allow others to copy my code. 
 I understand that copying code is considered as plagiarism.
 
 Student Name: Toh Ser Jia
 Student ID: 23031029
 Class: C372-2D-E63C-A
 Date created: 10/02/2025
 */

const express = require('express');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require("body-parser");
const app = express();

require('dotenv').config();

// ----------------------------Controllers--------------------------
const basicControl= require('./controller/basicControl');
const adminControl= require('./controller/adminControl');
const categoryControl= require('./controller/categoryControl');
const subcategoryControl= require('./controller/subcategoryControl');
const productControl= require('./controller/productControl');
const cartControl= require('./controller/cartControl');
const otherControl= require('./controller/otherControl');
const paypalController= require('./controller/paypalControl');
const orderController= require('./controller/orderControl');
const feedbackControl= require('./controller/feedbackControl');
const netsControl= require('./controller/netsQRcontrol');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Set up view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up session and flash messages
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; 
    next();
});

const db = require('./db.js');

//----------------------------Function---------------------------------
// const validateRegistration = (req, res, next) => {
//   const { username, email, password } = req.body;
//   if (!username || !email || !password) {
//       req.flash('error', 'All fields are required except for the profile picture.');
//       return res.redirect('/register');
//   }
//   if (password.length < 6) {
//       req.flash('error', 'Password should be at least 6 characters long.');
//       req.flash('formData', req.body);
//       return res.redirect('/register');
//   }
//   next();
// };


//----------------------------Route Page-------------------------------
app.get('/', basicControl.getIndex); // Get Index
app.get('/login', basicControl.getLogin); // Get Login Page
app.get('/register', basicControl.getRegister); //Get Register Page
app.get('/admin', adminControl.getDashboard ); //Get Admin Page
app.get('/adminUser', adminControl.getUser); //Get User Page
app.get('/addAdmin',adminControl.getAddUser); //Get Add Admin Page
app.get('/category', categoryControl.getCategory); //Get categry page
app.get('/adminCategory', categoryControl.getAdminCategory); //Get Admin category page
app.get('/addCategory', categoryControl.getAddCategory); // Get AddCategory
app.get('/editCategory/:id', categoryControl.getEditCategory); //Get editCategory
app.get('/subProduct/:categoryID', subcategoryControl.getSubProduct); //Get subcategory Page
app.get('/subProduct/:categoryID/:subcategoryID', subcategoryControl.getSubProductsBySubcategory); //Get subcategory product filtered
app.get('/adminSubCategory', subcategoryControl.getAdminSubProdct); //Get admin Subcategory page
app.get('/addSubCategory', subcategoryControl.getAddSubCategoryPage); //Get Add Subcategory Page
app.get('/editSubCategory/:subCategoryID', subcategoryControl.getEditSubCat); //Get edit Sub Category
app.get('/productID/:productID', productControl.getProductID); //Get Product ID
app.get('/adminProduct', productControl.getAdminProduct); //Get Admin Product
app.get('/addProduct', productControl.getAddProduct); //Get Add product
app.get('/cart', cartControl.getCart); //Get Cart
app.get('/futureUpdate', basicControl.getfuture); //Get future Update
app.get('/search', basicControl.getSearch);//Get search
app.get('/profile', basicControl.getProfile); //Get Profile
app.get('/adminBrand', otherControl.adminbrand);//Get admin Brand
app.get('/addBrand', otherControl.getAddBrand);//Get add brand
app.get('/editBrand/:id', otherControl.getEditBrand); //Get Edit Brand
app.get('/adminSC', otherControl.adminSC);//Get admin Size and color
app.get('/editProduct/:id',productControl.getEditProduct)//Get edit Product
app.get('/product/:id', productControl.getProduct);//get Product
app.get('/checkout', cartControl.checkout); //Checkout
app.get('/addVariant', productControl.getAddVariant); //Get Add variant
app.get('/history', orderController.getHistory); //Get History
app.get('/adminOrder', orderController.getAdminOrder); //Get Admin Order  
app.get('/addFeedback/:productId', feedbackControl.getAddFeedback); //Get Add Feedback






app.get('/logout', basicControl.logout); //Log Out
app.get('/deleteUser/:username', adminControl.deleteUser); //Delete user from admin
app.get('/deleteCategory/:categoryID', categoryControl.deleteCategory); //Delete Category
app.get('/deleteSubCategory/:subCategoryID', subcategoryControl.deleteSub); //Delete Sub Category
app.get('/deleteCart/:cartID', cartControl.deleteCart); //Delete Cart
app.get('/deleteProduct/:id', productControl.deleteProduct);// Delete Product
app.get('/deleteBrand/:id', otherControl.deleteBrand); //delete brand
app.get('/deleteColor/:id', otherControl.deleteColor);//Delete color
app.get('/deleteSize/:id', otherControl.deleteSize);//Delete Size
app.get('/deleteVariant/:id', productControl.deleteVariant);//Delete Variant

app.post('/register', upload.single('image'), basicControl.postRegister); //Register form
app.post('/login', basicControl.postLogin); //Login form
app.post('/addAdmin', upload.single('image'), adminControl.postAddUser); //Adding admin
app.post('/addCategory', upload.single('image'), categoryControl.addCategory); //Add category
app.post('/editCategory/:id', upload.single('image'), categoryControl.editCategory) //Edit Category
app.post('/addSubCategory', subcategoryControl.addSubCategory); //Add sub category
app.post('/editSubCategory/:subCategoryID', subcategoryControl.editSubCat);// Edit sub category
app.post('/addtocart', cartControl.addtocart); //Add to cart
app.post('/addProduct', upload.single('image'), productControl.addProduct); //Add Product
app.post('/editCart/:cartID', cartControl.editCart);//Edit Cart
app.post('/profile', upload.single('image'), basicControl.postProfile);//Edit Profile
app.post('/addBrand', upload.single('image'), otherControl.postBrand);//Add brand
app.post('/editBrand/:id',upload.single('image'), otherControl.editBrand);//edit brand
app.post('/addColor', otherControl.addColor);//Add color
app.post('/addSize', otherControl.addSize);//Add size
app.post('/addVariant', productControl.addVariant); //Add variant
app.post('/editProduct/:id', upload.single('image'), productControl.editProduct);//Edit product
app.post('/editStatus/:id', orderController.updateStatus);//Edit Status  
app.post('/addReview/:productId', upload.single('image'), feedbackControl.postAddFeedback);//Add Review
app.post('/editVariant/:id', productControl.editVariant); //Edit variant


//Paypal one
app.use(express.json());

app.post('/api/orders', paypalController.createOrderHandler);
app.post('/api/orders/:orderID/capture', paypalController.captureOrderHandler);
app.get('/checkout/:paymentMethod/:orderId/:transactionId', cartControl.checkout);
app.get('/401', (req, res) => {
    res.render('customer/401', { errors: req.flash('error') });
});

//Nets Payment
app.post('/generateNETSQR', netsControl.generateQrCode);
app.get("/nets-qr/success", (req, res) => {
    const user = req.session.user;
    if (!user || !user.UserID) {
        return res.status(401).send("User not authenticated");
    }

    // Retrieve from session
    const orderId = req.session.orderId;
    const transactionId = req.session.transactionId;

    console.log("Session Data:", req.session);
    console.log(`Order ID: ${orderId}, Transaction ID: ${transactionId}, User ID: ${user.UserID}`);

    if (!orderId || !transactionId) {
        return res.status(400).send("Invalid transaction. Please try again.");
    }

    const userID = user.UserID;

    const sqlCompany = "SELECT * FROM company";
    db.query(sqlCompany, (err, companyResult) => {
        if (err) {
            console.error("Error fetching company data:", err);
            return res.status(500).send("Error fetching company data");
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
                console.error("Error fetching cart data:", err);
                return res.status(500).send("Error fetching cart data");
            }

            let totalAmount = 0;
            cartResult.forEach(item => {
                totalAmount += item.price * item.cartQuantity;
            });

            const updatedDate = new Date();
            const orderSQL = `INSERT INTO orderlist 
                (productID, variantID, userID, quantity, paymentMethod, updatedDate, orderId, transactionId) 
                VALUES (?,?,?,?,"Nets QR", ?, ?, ?)`; 

            cartResult.forEach(orderItem => {
                db.query(orderSQL,
                    [orderItem.productID, orderItem.productVariantID, userID, orderItem.cartQuantity, updatedDate, orderId, transactionId], 
                    (error) => {
                        if (error) {
                            console.error("Error adding order:", error.message);
                            return res.status(500).send("Error adding order");
                        }
                    });
            });

            const clearCartSQL = `DELETE FROM cart WHERE userID = ?`;
            db.query(clearCartSQL, [userID], (error) => {
                if (error) {
                    console.error("Error clearing cart:", error.message);
                    return res.status(500).send("Error clearing cart");
                }
            });

            // Render invoice page
            res.render("customer/invoice", {
                cart: cartResult,
                total_payment: totalAmount.toFixed(2),
                userId: userID,
                orderDate: updatedDate,
                paymentMethod: "Nets QR",
                orderId: orderId,
                transactionId: transactionId,
                company: companyResult,
                message: "Transaction Successful!"
            });

            req.session.orderId = null;
            req.session.transactionId = null;
        });
    });
});



app.get("/nets-qr/fail", (req, res) => {
    res.render('customer/netsTxnFailStatus', { message: 'Transaction Failed. Please try again.' });
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));

