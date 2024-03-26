const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    product_details: [
        {
            product_id: {
                type: String,
                trim:true,
            },
            productimg:{
                type:String,
                trim:true,
            },
            product_name: {
                type: String,
                trim:true,
            },
            product_quantity: {
                type: Number,
            },
            product_weight: {
                type: String,
            },
            product_price: {
                type: Number,
            },
        } 
    ],
    payment_status: {
        type: String,
        default: "pennding"
    },
    user_name: {
        type: String,
    },
    user_id: {
        type: String,
    },
    session_id: {
        type: String,
    },

    email: {
        type: String,
    },
    mobile: {
        type: String,
    },
    altmobile: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    pincode: {
        type: String,
    },
    amount: {
        type: Number,
    },


    address: {
        type: String,
    },
    user_session_id: {
        type: String,
    },

    razorpay_order_id: {
        type: String,
    },
    razorpay_payment_id: {
        type: String,
    },
    razorpay_signature: {
        type: String,
    },
});
module.exports = mongoose.model("Order", orderSchema);

