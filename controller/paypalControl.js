/*
 I declare that this code was written by me. 
 I will not copy or allow others to copy my code. 
 I understand that copying code is considered as plagiarism.
 
 Student Name: Toh Ser Jia
 Student ID: 23031029
 Class: C372-2D-E63C-A
 Date created: 10/02/2025
 */

/*
Paypal keys
Note: 
- The keys are typically not stored here but in an .env file
- Replace the keys below with your own keys from paypal
*/
const PAYPAL_CLIENT_ID = "ATuqvx4VKAUUvIuduBaah1DGy6z2IvPAUJXC7H1q6l_qJsevZ6cO5iDhhDKBPQt1631Qe8jMs8abCA0E";
const PAYPAL_CLIENT_SECRET = "EKqjUQ6Eras-Q5q2DlZl1tOu4pMQ7I4-GnWd3U_o_4IlB7HJIjzuFOO9lCbzz7pszi979zo3kP5ReIte";

const BASE = "https://api-m.sandbox.paypal.com";

/**
 * Generate an access token for PayPal API.
 */
async function generateAccessToken() {
    const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

    const request = await fetch(`${BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "client_credentials"
        })
    });

    const json = await request.json();
    return json.access_token;
}

/**
 * Handle API responses.
 */
async function handleResponse(response) {
    try {
        const jsonResponse = await response.json();
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

/**
 * Create an order for PayPal checkout.
 */
const createOrder = async (cart) => {
    const processedItems = cart.map(item => ({
        name: item.name,
        color: item.colorName || "N/A",
        size: item.size || "N/A",
        unit_amount: {
            currency_code: "SGD",
            value: Number(item.price).toFixed(2),
        },
        quantity: item.quantity.toString(),
    }));

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    console.log("Processed items: ", processedItems);

    const accessToken = await generateAccessToken();
    console.log("Access Token: " + accessToken);

    const url = `${BASE}/v2/checkout/orders`;

    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                items: processedItems,
                amount: {
                    currency_code: "SGD",
                    value: totalAmount,
                    breakdown: {
                        item_total: {
                            currency_code: "SGD",
                            value: totalAmount,
                        },
                    },
                },
            },
        ],
    };

    console.log(payload);

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    return handleResponse(response);
};

/**
 * Capture a PayPal order.
 */
const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${BASE}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
    });

    return handleResponse(response);
};

/**
 * Express route handlers.
 */
exports.createOrderHandler = async (req, res) => {
    try {
        console.log("Inside create order method", req.body);
        const { cart } = req.body;
        const { jsonResponse, httpStatusCode } = await createOrder(cart);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
};

exports.captureOrderHandler = async (req, res) => {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to capture order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
};
