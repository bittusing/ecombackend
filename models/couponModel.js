const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        coupon_name: {
            type: String,
            trim: true,
        },
        coupon_code: {
            type: String,
            trim: true,
        },
        coupon_value: {
            type: Number,
            trim: true,
        },
        coupon_type: {
            type: String,
            trim: true,
        },
        coupon_minimun_apply_amount: {
            type: Number,
            trim: true,
        },
        coupon_status: {
            type: String,
            trim: true,
        },

    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("coupon", couponSchema);
