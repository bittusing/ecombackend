const Product=require('../models/productModel'); 
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");


// create lost reason

exports.addproduct = catchAsyncErrors(async (req, res, next) => {
    // let images = [];  
    // if (typeof req.body.images === "string") {
    //   images.push(req.body.images);
    // } else {
    //   images = req.body.images;
    // }
  
    // const imagesLinks = [];
  
    // for (let i = 0; i < 1; i++) {
    //   const result = await cloudinary.v2.uploader.upload(images[i], {
    //     folder: "products",
    //   });
    // imagesLinks.push({
    //     public_id: result.public_id,
    //     url: result.secure_url,
    //   });
    // }
    // req.body.images = imagesLinks;
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message:"Product Added Successfully",
      product,
    });
  });
// Delete lost reason

exports.deleteproduct=catchAsyncErrors(async (req,res,next)=>{

   const product=await Product.findById(req.params.id);

   if(!product){
     return next(new ErrorHander("product is not found",404));
   }

   await product.deleteOne();   

   res.status(201).json({
     success:true,
     message:"Deleated Successfully",
     product,
   }) 
   
}) 

// get All lost reason
exports.getAllproduct=catchAsyncErrors(async(req,res,next)=>{
         const product=await Product.find();

         res.status(200).json({
           success:true,
           product
         })
})

////  update Lost Reason 

exports.updateproduct=catchAsyncErrors(async (req,res,next)=>{
      const product=await Product.findById(req.params.id);  
 if(!product){
       return next(new ErrorHander("product is not found",404));
     }
  const  product1=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
     })
    res.status(200).json({
        success:true,
        message:"Product Update Successfully",
        product1
     })
})