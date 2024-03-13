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