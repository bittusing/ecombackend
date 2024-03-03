const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxlength: [8, "price can not exceed 8 characters"]
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [
       
    ],
    weightwishprice: [

    ],  
    category: {
        type: mongoose.Schema.ObjectId,
        // required:[true,"Please Enter Product Category"]
    },
    subcategory: {
        type: mongoose.Schema.ObjectId,
        // required:[true,"Please Enter Product Category"]
    },
    brand: {
        type: mongoose.Schema.ObjectId,
        // required:[true,"Please Enter Product Category"]
    },
    Stock: {
        type: Number,
        required: [true, "please enter product stock"],
        maxLength: [4, "Stock can not exceed 4 characters"],
        default: 1
    },
    numofReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", productSchema);