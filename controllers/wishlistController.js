const Wishlist = require('../models/wishListModel');
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


exports.addWishlist = catchAsyncErrors(async (req, res, next) => {
    const wishlist = await Wishlist.create(req.body);
    res.status(201).json({
        success: true,
        message: "Added to wishlist Successfully",
        wishlist,
    });
});

//////  delete all for work 

exports.deleteaddwishlist = catchAsyncErrors(async (req, res, next) => {

    const wishlist = await Wishlist.deleteMany();

    res.status(201).json({
        success: true,
        message: "Deleted All Successfully",
    });
});

/// get by session id 
exports.getAllwishlistByUserId = catchAsyncErrors(async (req, res, next) => {
    const { user_id } = req.body;
    const wishlist = await Wishlist.find({ user_id });
    res.status(201).json({
        success: true,
        message: "Get All Successfully",
        wishlist
    });
});