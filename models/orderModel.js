const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    product_details: [
        {
            product_id: {
                type: String,
                trim: true,
            },
            productimg: {
                type: String,
                trim: true,
            },
            product_name: {
                type: String,
                trim: true,
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
        default: "Pending"
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
    address: {
        type: String,
    },

    ////for other shipping address
    Counrty1: {
        type: String,
    },
    state1: {
        type: String,
    },
    city1: {
        type: String,
    },
    pincode1: {
        type: String,
    },
    address1: {
        type: String,
    },
    user_name1: {
        type: String,
    },
    mobile1: {
        type: String,
    },

    amount: {
        type: Number,
    },
    coupanAmount:{
        type: Number,
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
    invoice_no: {
        type: String,
    },
    order_no:{
        type: String,  
    },

},
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Order", orderSchema);

