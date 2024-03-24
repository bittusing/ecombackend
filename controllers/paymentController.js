const crypto = require("crypto");
const Payment = require('../models/paymentModel.js');
const SaveOrder = require('../models/orderModel.js');
const Cart = require('../models/cartModel.js');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id: 'rzp_test_4cr8rot2NvnR3G',
    key_secret: 'u3zXYfGTen225BMRuYBqsaOt',
});


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
        const order = await SaveOrder.updateOne(
            { razorpay_order_id },
            { razorpay_payment_id, razorpay_signature, payment_status: 'success' }
        );
        await Cart.deleteMany(order?.session_id);

        res.redirect(
            `http://localhost:3001/SuccessPage?reference=${razorpay_order_id}`
        );
    } else {
        res.redirect(
            `http://localhost:3001/PaymentFaildPage`
        );
        // res.status(400).json({
        //     success: false,
        // });
    }
});

exports.GetOrderBySessionIdOrUserId = catchAsyncErrors(async (req, res, next) => {
      const {user_id,session_id}=req.body;
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

