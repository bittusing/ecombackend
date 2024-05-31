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
  const { session_id } = req.body;
  const cart = await Cart.find({ session_id });
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

  const coupon = await Coupon.fi(req.body.params);
  await coupon.deleteOne();
  res.status(201).json({
    success: true,
    message: 'Coupon Delete Successfully',
    coupon
  });
})

/////// Edit coupon




exports.ApplyCouponCode = catchAsyncErrors(async (req, res, next) => {
  const { coupon_code, minimum_apply_value } = req.body;

  // Find the coupon with the given code and ensure it is enabled
  const coupon = await Coupon.findOne({ coupon_code, coupon_status: "Enable" });

  if (coupon) {
    const coupon_minimum_apply_amount = coupon.coupon_minimum_apply_amount;

    if (minimum_apply_value >= coupon_minimum_apply_amount) {
      res.status(201).json({
        success: true,
        message: `Successfully applied this coupon`,
        coupon
      });
    } else {
      res.status(201).json({
        success: false,
        message: `Minimum Rs ${coupon_minimum_apply_amount} amount required for this coupon`,
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