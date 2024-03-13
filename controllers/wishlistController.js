const Wishlist = require('../models/wishListModel');
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


exports.addWishlist = catchAsyncErrors(async (req, res, next) => {
    const {user_id,productid} =req.body;
    const wish=await Wishlist.find({user_id,productid});
    if(wish.length>0){
        res.status(201).json({
            success: true,
            message: "Already Added to wishlist..",
        });
    }else{
        const wishlist = await Wishlist.create(req.body);
        res.status(201).json({
            success: true,
            message: "Add to wishlist Successfully",
            wishlist,
        });
    }
       
});
/////// removewishlistbycartid
exports.removewishlistbycartid=catchAsyncErrors(async(req,res,next)=>{
    const wishlist = await Wishlist.findById(req.params.id);
  
    if (!wishlist) {
      return next(new ErrorHander("cart Not Found", 404));
    }
    await wishlist.deleteOne();
  
    res.status(200).json({
      success: true,
      message: "wishlist Delete Successfully",
      wishlist,
    });
  })

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