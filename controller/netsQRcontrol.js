const axios = require("axios");

exports.generateQrCode = async (req, res) => {
    const { cartTotal } = req.body;
    console.log("Cart Total:", cartTotal);

    try {
        const requestBody = {
            txn_id: "sandbox_nets|m|8ff8e5b6-d43e-4786-8ac5-7accf8c5bd9b", // Default for testing
            amt_in_dollars: cartTotal,
            notify_mobile: 0,
        };

        const response = await axios.post(
            `https://sandbox.nets.openapipaas.com/api/v1/common/payments/nets-qr/request`,
            requestBody,
            {
                headers: {
                    "api-key": process.env.API_KEY,
                    "project-id": process.env.PROJECT_ID,
                },
            }
        );

        const qrData = response.data.result?.data;
        console.log("QR Data Response:", qrData);

        if (qrData && qrData.response_code === "00" && qrData.txn_status === 1 && qrData.qr_code) {
            const transactionId = qrData.txn_retrieval_ref;
            const orderId = qrData.txn_nets_qr_id;
            const qrCodeUrl = `data:image/png;base64,${qrData.qr_code}`;
            
            console.log(`Transaction ID: ${transactionId}, Order ID: ${orderId}`);

            // ✅ Store transactionId & orderId in session
            req.session.transactionId = transactionId;
            req.session.orderId = orderId;
            console.log("Stored in session:", req.session);

            res.render("customer/netsQr", {
                total: cartTotal,
                title: "Scan to Pay",
                qrCodeUrl,
                transactionId,
                orderId,
                networkCode: qrData.network_status,
                timer: 300, // Timer in seconds
                webhookUrl: `https://sandbox.nets.openapipaas.com/api/v1/common/payments/nets/webhook`,
                apiKey: process.env.API_KEY,
                projectId: process.env.PROJECT_ID,
            });
        } else {
            console.error("Error: Invalid QR response", qrData);
            res.render("customer/netsQrFail", {
                title: "Error",
                responseCode: qrData?.response_code || "N.A.",
                instructions: qrData?.network_status === 0 ? qrData?.instruction : "",
                errorMsg: "Transaction failed. Please try again.",
            });
        }
    } catch (error) {
        console.error("Error in generateQrCode:", error.message);
        res.redirect("/nets-qr/fail");
    }
};
