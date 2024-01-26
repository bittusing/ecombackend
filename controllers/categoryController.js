const Category=require('../models/categoryModel'); 
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");



// create lost reason

exports.addCategory=catchAsyncErrors(async (req,res,next)=>{

          const category=await Category.create(req.body);

          res.status(201).json({
           success: true,
           category,
         });  
})

// Delete lost reason

exports.deletecategory=catchAsyncErrors(async (req,res,next)=>{

   const category=await Category.findById(req.params.id);

   if(!category){
     return next(new ErrorHander("category is not found",404));
   }

   await category.deleteOne();   

   res.status(201).json({
     success:true,
     message:"Deleated Successfully",
     category,
   }) 
   
}) 

// get All lost reason
exports.getAllcategory=catchAsyncErrors(async(req,res,next)=>{
         const category=await Category.find();

         res.status(200).json({
           success:true,
           category
         })
})

////  update Lost Reason 

exports.updateCategory=catchAsyncErrors(async (req,res,next)=>{
     
     const category=await Category.findById(req.params.id);  

     if(!category){
       return next(new ErrorHander("category is not found",404));
     }

    const  category1=await Category.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
     })

     res.status(200).json({
        success:true,
        category1
     })
})