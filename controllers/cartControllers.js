const Cart=require('../models/cartModel'); 
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


exports.addCart=catchAsyncErrors(async (req,res,next)=>{

          const cart=await Cart.create(req.body);

          res.status(201).json({
           success: true,
           message:"Added to Cart List Successfully",
           cart,
         });  
});

//////  delete all for work 

exports.deleteaddcart=catchAsyncErrors(async (req,res,next)=>{

  const cart=await Cart.deleteMany();

  res.status(201).json({
   success: true,
   message:"Deleted All Successfully",
 });  
});

/////////removecartbycartid
exports.removecartbycartid=catchAsyncErrors(async(req,res,next)=>{
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
exports.getAllCartBySessionId=catchAsyncErrors(async (req,res,next)=>{
           const {session_id} =req.body;
            const cart=await Cart.find({session_id});
           res.status(201).json({
            success: true,
            message:"Get All Successfully",
            cart
          });  
});