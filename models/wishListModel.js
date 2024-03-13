const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        productid: {
          type: String,
          trim: true,
        },
        productname: {
          type: String,
          trim: true,
        },
        productPrice:{
            type: String,
            trim: true, 
        },
        productWeight:{
            type: String,
            trim: true, 
        },
        Quantity:{
            type:Number,
            trim:true,
        },
        productimg:{
          type:String,
          trim:true,
      },
        user_id:{
            type: String,
            trim: true, 
        },
        session_id:{
            type: String,
            trim: true, 
        }
      },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("wishlist", wishlistSchema);
