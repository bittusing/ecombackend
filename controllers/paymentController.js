const crypto = require("crypto");
const nodemailer = require('nodemailer');
const Payment = require('../models/paymentModel.js');
const SaveOrder = require('../models/orderModel.js');
const Shipment = require('../models/shipmentModel.js')
const Cart = require('../models/cartModel.js');
const request = require('request');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id: 'rzp_test_4cr8rot2NvnR3G',
    key_secret: 'u3zXYfGTen225BMRuYBqsaOt',
});



// Create a Nodemailer transporter


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'myles9@ethereal.email',
        pass: 'ekGav56KwBgt1Re8cD'
    }
});

function generateInvoice(order) {
    // Extract relevant information from the order document
    const orderId = order.razorpay_order_id;
    const customerName = order.user_name;
    const customerEmail = order.email;
    const items = order.product_details;
    const totalPrice = order.amount;

    // Build the invoice HTML string
    let invoice = `
        <h2>Invoice</h2>
        <p>Order ID: ${orderId}</p>
        <p>Customer Name: ${customerName}</p>
        <p>Email: ${customerEmail}</p>
        <table>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>`;

    // Loop through each item in the order and add it to the invoice
    items.forEach(item => {
        invoice += `
            <tr>
                <td>${item.product_name}</td>
                <td>${item.product_quantity}</td>
                <td>${item.product_price}</td>
                <td>${item.product_quantity * item.product_price}</td>
            </tr>`;
    });

    // Add total price
    invoice += `
            <tr>
                <td colspan="3">Total</td>
                <td>${totalPrice}</td>
            </tr>
        </table>`;

    return invoice;
}




exports.checkout = catchAsyncErrors(async (req, res, next) => {
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);
    const newdata = await { ...req.body, razorpay_order_id: order?.id }
    await SaveOrder.create(newdata);
    res.status(200).json({
        success: true,
        order,
    });
})
exports.paymentVerification = catchAsyncErrors(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", instance.key_secret)
        .update(body.toString())
        .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Database comes here

        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });
        // Update order status in your database

        const updatedOrder = await SaveOrder.findOneAndUpdate(
            { razorpay_order_id },
            { razorpay_payment_id, razorpay_signature, payment_status: 'success' },
            { new: true } // Return the updated document
        );


        // Generate invoice
        const invoice = generateInvoice(updatedOrder); // Assuming generateInvoice function is defined

        // Send invoice via email
        const mailOptions = {
            from: 'yadav188@gmail.com',
            to: updatedOrder?.email, // Assuming you have stored customer email in the order object
            subject: 'Invoice for Your Order',
            html: invoice // Assuming invoice is an HTML string
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.error('Error occurred while sending email:', error);
            } else {
                // console.log('Email sent:', info.response);
            }
        });
        await Cart.deleteMany({ session_id: updatedOrder?.session_id });
        res.redirect(
            `https://www.decasys.in/SuccessPage?reference=${razorpay_order_id}`
        );
    } else {
        res.redirect(
            `https://www.decasys.in/PaymentFaildPage`
        );
        // res.status(400).json({
        //     success: false,
        // });
    }
});

exports.GetOrderBySessionIdOrUserId11 = catchAsyncErrors(async (req, res, next) => {
    const { user_id, session_id } = req.body;
    const allOrder = await SaveOrder.find({
        $or: [ 
            { user_id: user_id },
            { session_id: session_id }
        ]
    });
    
    
 res.status(200).json({
        success: true,
        allOrder,
    });

   
});

exports.GetOrderBySessionIdOrUserId = catchAsyncErrors(async (req, res, next) => {
    try {
        const { user_id, session_id } = req.body;

        // Validate that either user_id or session_id is provided
        if (!user_id && !session_id) {
            return res.status(400).json({ success: false, message: "Either user_id or session_id must be provided" });
        }

        const query = {
            $or: [
                { user_id: user_id },
                { session_id: session_id }
            ]
        };

        const allOrder = await SaveOrder.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "shipments",
                    let: { razorpay_order_idString: "$razorpay_order_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$razorpay_order_id", "$$razorpay_order_idString"],
                                },
                            },
                        },
                    ],
                    as: "tracking_details",
                },
            },
        ]);

        res.status(200).json({
            success: true,
            allOrder,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


exports.createShipments = catchAsyncErrors(async (req, res, next) => {
    const { razorpay_order_id } = req.body;

    try {
        // Find the order details from the database based on the razorpay_order_id
        const order = await SaveOrder.findOne({ razorpay_order_id });

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check if a shipment with the same razorpay_order_id exists in the database
        const ShipingCheck = await Shipment.findOne({ razorpay_order_id });
        if (ShipingCheck) {
            return res.status(400).json({ success: false, message: "This order is already in shipping" });
        }

        // Construct the order_items array from the product_details in the order
        const orderItems = order.product_details.map(product => ({
            name: product.product_name,
            qty: product.product_quantity.toString(),
            price: product.product_price.toString(),
            sku: product.product_id
        }));

        const options = {
            method: 'POST',
            url: 'https://api.nimbuspost.com/v1/shipments',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3MTE0NTk1NTEsImp0aSI6IlZvaWtEeXNcL3Q4OTQ5SVBqWnNXUThCXC9kbmhxc3FjNUZyMW9OY1YraHNqRT0iLCJuYmYiOjE3MTE0NTk1NTEsImV4cCI6MTcxMTQ3MDM1MSwiZGF0YSI6eyJ1c2VyX2lkIjoiMTQ0MzE0IiwicGFyZW50X2lkIjoiMCJ9fQ.CKdW1K51yzKs_fOWQOY1yOpGDELK1_Nq7L_LC0LGNNjJ-GE6BhTvi-9JLddeshCjgQdlzPguCkaTYzd37k-MTQ'
            },
            body: JSON.stringify({
                "order_number": razorpay_order_id,
                "shipping_charges": 40,
                "discount": 100,
                "cod_charges": 30,
                "payment_type": "prepaid",
                "order_amount": order.amount,
                "package_weight": 300,
                "package_length": 10,
                "package_breadth": 10,
                "package_height": 10,
                "request_auto_pickup": "yes",
                "consignee": {
                    "name": order.user_name,
                    "address": order.address,
                    "address_2": order.address,
                    "city": order.city,
                    "state": order.state,
                    "pincode": order.pincode,
                    "phone": order.mobile
                },
                "pickup": {
                    "warehouse_name": "WAREHOUSE 162-A",
                    "name": "JULIET GEORGE",
                    "address": "162-A, POCKET E, LIG FLATS,",
                    "address_2": "GTB ENCLAVE, NAND NAGRI",
                    "city": "NORTH EAST DELHI",
                    "state": "DELHI",
                    "pincode": "110093",
                    "phone": "9971860349"
                },
                "order_items": orderItems,
                "courier_id": "1",
                "is_insurance": "0"
            })
        };

        request(options, async function (error, response) {
            if (error) {
                console.error('Error creating shipment:', error);
                return res.status(500).json({ success: false, message: "Error creating shipment" });
            }

            const responseData = JSON.parse(response.body); // Parse the response body to JSON
            const { status, data } = responseData;
          
            if (status && data) {
                const { order_id, shipment_id, awb_number, courier_id, courier_name, additional_info, payment_type, label, manifest } = data;

                const newShipment = new Shipment({
                    razorpay_order_id,
                    order_id,
                    shipment_id,
                    awb_number,
                    courier_id,
                    courier_name,
                    additional_info,
                    payment_type,
                    label,
                    manifest
                });

                try {
                    const savedShipment = await newShipment.save();
                    res.status(200).json({ success: true, message: "Shipment created successfully", savedShipment });
                } catch (saveError) {
                    console.error('Error saving shipment to database:', saveError);
                    res.status(500).json({ success: false, message: "Error saving shipment to database" });
                }
            } else {
                console.error('Invalid response data:', responseData);
                res.status(500).json({ success: false, message: "Invalid response data" });
            }
        });
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

exports.getTrackingDetails=catchAsyncErrors(async(req,res,next)=>{
    const { razorpay_order_id } = req.body;
    try {
        const order = await SaveOrder.findOne({ razorpay_order_id });

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(500).json({ success: true, order });
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

});




