const Product=require('../models/productModel'); 
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const category = require("../models/categoryModel");
const { ObjectId } = require('mongoose').Types;

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

 exports.BulkProductDelete = catchAsyncErrors(async (req, res, next) => {
  const leadIds = req.body.ids; 

  const result = await Product.deleteMany({ _id: { $in: leadIds } });
  res.status(200).json({
    success: true,
    message: "Product Has Been Deleted",
  });
});



// get All lost reason
exports.getAllproduct=catchAsyncErrors(async(req,res,next)=>{
        const product =await Product.aggregate([
          {
            $lookup:{
               from:"categories",
               let: { categoryString: "$category" },
               pipeline: [
                 {
                   $match: {
                     $expr: {
                       $eq: ["$_id", { $toObjectId: "$$categoryString" }],
                     },
                   },
                 },
                 {
                   $project: {
                    category_name: 1,
                   },
                 },
               ],
               as: "Category",
            }
          },
          {
            $lookup:{
               from:"subcategories",
               let: { subcategoryString: "$subcategory" },
               pipeline: [
                 {
                   $match: {
                     $expr: {
                       $eq: ["$_id", { $toObjectId: "$$subcategoryString" }],
                     },
                   },
                 },
                 {
                   $project: {
                    subcategory: 1,
                   },
                 },
               ],
               as: "subcategory",
            }
          },
          {
            $lookup:{
               from:"brands",
               let: { brandString: "$brand" },
               pipeline: [
                 {
                   $match: {
                     $expr: {
                       $eq: ["$_id", { $toObjectId: "$$brandString" }],
                     },
                   },
                 },
                 {
                   $project: {
                    brand: 1,
                   },
                 },
               ],
               as: "brand",
            }
          }
         ])
      
         res.status(200).json({
           success:true,
           product
         })
});

////get getAllproductbyid 
exports.getAllproductbyid=catchAsyncErrors(async(req,res,next)=>{
  const product=await Product.findById(req.params.id);
  if(!product){
    return next(new ErrorHander("product is not found",404));
  }
  res.status(201).json({
    success:true,
    product,
  }) 
});

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