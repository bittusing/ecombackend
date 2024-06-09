const Cart = require('../models/cartModel');
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Coupon = require('../models/couponModel');
exports.addCart = catchAsyncErrors(async (req, res, next) => {
  const { productid, session_id, productWeight, user_id } = req.body;
  let cart = await Cart.findOne({ productid, session_id, productWeight });
  if (cart) {
    const updatedQuantity = parseInt(cart.Quantity) + 1;
    const update_data = { Quantity: updatedQuantity };
    cart = await Cart.findOneAndUpdate({ productid, session_id, productWeight }, update_data, { new: true });
  } else {
    cart = await Cart.create(req.body);
  }
  res.status(201).json({
    success: true,
    message: "Added to Cart List Successfully",
    cart,
  });
});

exports.addCartDecreaseQuantity = catchAsyncErrors(async (req, res, next) => {
  const { productid, session_id, productWeight, user_id } = req.body;
  let cart = await Cart.findOne({ productid, session_id, productWeight });
  if (cart) {
    const updatedQuantity = parseInt(cart.Quantity) - 1;
    const update_data = { Quantity: updatedQuantity };
    cart = await Cart.findOneAndUpdate({ productid, session_id, productWeight }, update_data, { new: true });
  } else {
    cart = await Cart.create(req.body);
  }
  res.status(201).json({
    success: true,
    message: "Added to Cart List Successfully",
    cart,
  });
});

//////  delete all for work 

exports.deleteaddcart = catchAsyncErrors(async (req, res, next) => {

  const cart = await Cart.deleteMany();

  res.status(201).json({
    success: true,
    message: "Deleted All Successfully",
  });
});

/////////removecartbycartid
exports.removecartbycartid = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart) {
    return next(new ErrorHander("cart Not Found", 404));
  }
  await cart.deleteOne();

  res.status(200).json({
    success: true,
    message: "cart Delete Successfully",
    cart,
  });
})

/// get by session id 
exports.getAllCartBySessionId = catchAsyncErrors(async (req, res, next) => {
  const { session_id , user_id} = req.body;
  // const cart = await Cart.find({ session_id || user_id });
  // Create a query object to use with MongoDB's $or operator
  const query = {
    $or: [
      { session_id: session_id },
      { user_id: user_id }
    ]
  };

  // Find carts matching either session_id or user_id
  const cart = await Cart.find(query);
  res.status(201).json({
    success: true,
    message: "Get All Successfully",
    cart
  });
});

///// genrate coupon
exports.GenerateCoupon = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({
    success: true,
    message: "Coupon Save Successfully",
    coupon
  });
});

////// getallGenerateCoupon
exports.getallGenerateCoupon = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.find();
  res.status(201).json({
    success: true,
    coupon
  });
});

////// delete coupon
exports.DeleteCoupon = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  // Find and delete the coupon by ID
  const coupon = await Coupon.findByIdAndDelete({_id:id});

  if (coupon) {
    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Coupon not found',
    });
  }
});

/////// Edit coupon




exports.ApplyCouponCode = catchAsyncErrors(async (req, res, next) => {
  const { coupon_code, minimum_apply_value } = req.body;
 const coupon = await Coupon.findOne({ coupon_code, coupon_status: "Enable" });

 if (coupon) {
    if (minimum_apply_value >= coupon?.coupon_minimun_apply_amount) {
      res.status(201).json({
        success: true,
        message: `Successfully applied this coupon`,
        coupon
      });
    } else {
      res.status(201).json({
        success: false,
        message: `Minimum Rs ${coupon?.coupon_minimun_apply_amount} amount required for this coupon`,
        coupon
      });
    }
  } else {
    res.status(201).json({
      success: false,
      message: `This coupon is not active`,
      });
  }
});