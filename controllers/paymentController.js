const crypto = require("crypto");
const nodemailer = require('nodemailer');
const Payment = require('../models/paymentModel.js');
const SaveOrder = require('../models/orderModel.js');
const Shipment = require('../models/shipmentModel.js')
const Cart = require('../models/cartModel.js');
const request = require('request');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Razorpay = require('razorpay');
const axios = require('axios');
const { ObjectId } = require('mongoose').Types;
const instance = new Razorpay({
    //live
    key_id: 'rzp_live_MPhLpCWE9p01d7',
    key_secret: 'G4L0qb1wx3oa9KvPOexxaiX8',

    ////test
    // key_id:'rzp_test_4cr8rot2NvnR3G',
    // key_secret:'u3zXYfGTen225BMRuYBqsaOt',
}); 
 


// Create a Nodemailer transporter


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'contact@decasys.in', 
      pass: 'vsks gpzi uhjc ilnx'    // Your Gmail password or app password if 2FA is enabled
    }
  });

function generateInvoice(order) {
    // Extract relevant information from the order document
    const orderId = order?.order_no;
    const customerName = order?.user_name;
    const customerEmail = order?.email;
    const items = order?.product_details;
    const totalPrice = order?.amount;

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


const getLastInvoiceNumber = async () => {
    const lastInvoice = await SaveOrder.findOne({}).sort({ invoice_no: -1 }).exec();
    return lastInvoice ? lastInvoice?.invoice_no : 24000; 
};

const getLastOrderNumber = async () => {
    const lastOrder = await SaveOrder.findOne({}).sort({ order_no: -1 }).exec();
    return lastOrder ? parseInt(lastOrder?.order_no?.slice(2)) : 100000; 
};

const generateInvoiceNumber = (lastInvoiceNo) => {
    return parseInt(lastInvoiceNo) + parseInt(1);
};

const generateOrderNumber = (lastOrderNo) => {
    const prefix = 'DE';
    const newNumber = lastOrderNo + 1;
    return `${prefix}${newNumber.toString().padStart(6, '0')}`;
};

exports.checkout = catchAsyncErrors(async (req, res, next) => {
    const lastInvoiceNo = await getLastInvoiceNumber();
    
    const lastOrderNo = await getLastOrderNumber();
    
    const newInvoiceNo = generateInvoiceNumber(lastInvoiceNo);
   
    const newOrderNo = generateOrderNumber(lastOrderNo);
    
   
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);
   

    const newdata = await { ...req.body, razorpay_order_id: order?.id,  invoice_no: newInvoiceNo,
        order_no: newOrderNo }

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
            { razorpay_payment_id, razorpay_signature, payment_status: 'Success' },
            { new: true } // Return the updated document
        );


        // Generate invoice
        const invoice = generateInvoice(updatedOrder); 

        // Send invoice via email
        const mailOptions = {
            from: 'contact@decasys.in',
            to: updatedOrder?.email, // Assuming you have stored customer email in the order object
            subject: 'Invoice for Your Order',
            html: invoice // Assuming invoice is an HTML string
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                 console.error('Error occurred while sending email:', error);
            } else {
                 console.log('Email sent:', info.response);
            }
        });
        await Cart.deleteMany({ session_id: updatedOrder?.session_id });
        res.redirect(
            `https://www.decasys.in/SuccessPage?reference=${razorpay_order_id}`
            // `http://localhost:3001/SuccessPage?reference=${razorpay_order_id}`
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
            { $sort: { createdAt: -1 } } 
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

exports.GetOrderByOrderId = catchAsyncErrors(async (req, res, next) => {
    const orderid = req.params.id;
    console.log(orderid)
    const allOrder = await SaveOrder.aggregate([
        {
            $match: {
                _id:  new ObjectId(orderid),
            }
        },
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

    // Assuming you want to send back the first matched order
    if (allOrder.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order: allOrder[0] });
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
            
         // Fetch token from Nimbuspost
         const tokenConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.nimbuspost.com/v1/users/login',
            headers: { 
                'content-type': 'application/json'
            },
            data: JSON.stringify({
                "email": "decasys+1488@yahoo.co.in",
                "password": "1Ih1XvCgov"
            })
        };

        const tokenResponse = await axios.request(tokenConfig);
        const token = tokenResponse?.data?.data;

        // console.log('token',tokenResponse?.data.data)
        const options = {
            method: 'POST',
            url: 'https://api.nimbuspost.com/v1/shipments',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "order_number": razorpay_order_id,
                "shipping_charges": 40,
                "discount": 100,
                "cod_charges": 30,
                "payment_type": "prepaid",
                "order_amount": order.amount,
                "package_weight": 720,
                "package_length": 25,
                "package_breadth": 12,
                "package_height": 12,
                "request_auto_pickup": "yes",
                "consignee": {
                    "name": order.user_name1?order.user_name1:order.user_name,
                    "address": order.address1?order.address1:order.address,
                    "address_2": order.address1?order.address1:order.address,
                    "city": order.city1?order.city1:order.city,
                    "state": order.state1?order.state1:order.state,
                    "pincode": order.pincode1?order.pincode1:order.pincode,
                    "phone": order.mobile1?order.mobile1:order.mobile
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
            // console.log(responseData)
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


exports.getTrackingDetails = catchAsyncErrors(async (req, res, next) => {
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


exports.GetAllOrder = catchAsyncErrors(async (req, res, next) => {
    const allOrder = await SaveOrder.find();
    res.status(200).json({ success: true, allOrder });
})

exports.GetOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const allOrder = await SaveOrder.findById(req.params.id);
    res.status(200).json({ success: true, allOrder });
})




