const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({

    product_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    user_id: {
        type: String,
    },
    session_id: {
        type: String,
    },
    name: {
        type: String,

    },
    rating: {
        type: Number,

    },
    comment: {
        type: String,

    },
    images: [
       
    ],
    title: {
        type: String,
  },
    Verified_Purchase: {
        type: Number,
        default: 0,
    },
    approved: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Review", reviewSchema);