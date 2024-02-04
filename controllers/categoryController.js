const Category=require('../models/categoryModel'); 
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Subcategory=require('../models/subcategoryModel');
const Brand =require('../models/brandModel');

// create lost reason

exports.addCategory=catchAsyncErrors(async (req,res,next)=>{

          const category=await Category.create(req.body);

          res.status(201).json({
           success: true,
           message:"Product Added Successfully",
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
        message:"Update Successfully",
        category1
     })
})


////////////  add subcategory  
exports.addsubcategory=catchAsyncErrors(async (req,res,next)=>{
  const subcategory=await Subcategory.create(req.body);
 res.status(201).json({
   success: true,
   message:"Subcategory Added Successfully",
   subcategory,
 });  
});

////////////delete subcategory
exports.deletesubcategory=catchAsyncErrors(async (req,res,next)=>{

  const subcategory=await Subcategory.findById(req.params.id);

  if(!subcategory){
    return next(new ErrorHander("subcategory is not found",404));
  }

  await Subcategory.deleteOne();   

  res.status(201).json({
    success:true,
    message:"Deleated Successfully",
    subcategory,
  }) 
  
}) 

////////////get all sub category
exports.getAllsubcategory=catchAsyncErrors(async(req,res,next)=>{
  const subcategory=await Subcategory.find();

  res.status(200).json({
    success:true,
    subcategory
  })
})

///////////update subcategory
exports.updatesubCategory=catchAsyncErrors(async (req,res,next)=>{
     
  const subcategory=await Subcategory.findById(req.params.id);  

  if(!subcategory){
    return next(new ErrorHander("subcategory is not found",404));
  }

 const  subcategory1=await Subcategory.findByIdAndUpdate(req.params.id,req.body,{
     new:true,
     runValidators:true,
     useFindAndModify:false,
  })

  res.status(200).json({
     success:true,    
     message:"Update Successfully",
     subcategory1
  })
})

///////////////add brand
exports.addbrand=catchAsyncErrors(async (req,res,next)=>{
  const brand=await Brand.create(req.body);
 res.status(201).json({
   success: true,
   message:"Brand Added Successfully",
   brand,
 });  
});
///////////////  delete brand
exports.deletebrand=catchAsyncErrors(async (req,res,next)=>{

  const brand=await Brand.findById(req.params.id);

  if(!brand){
    return next(new ErrorHander("brand is not found",404));
  }
 await brand.deleteOne();   
  res.status(201).json({
    success:true,
    message:"Deleated Successfully",
    brand,
  }) 
 }) 
////////////// get all brand 
exports.getAllbrand=catchAsyncErrors(async(req,res,next)=>{
  const brand=await Brand.find();

  res.status(200).json({
    success:true,
    brand
  })
})
///////////////// update brand
exports.updatebrand=catchAsyncErrors(async (req,res,next)=>{
     
  const brand=await Brand.findById(req.params.id);  

  if(!brand){
    return next(new ErrorHander("brand is not found",404));
  }

 const  brand1=await Brand.findByIdAndUpdate(req.params.id,req.body,{
     new:true,
     runValidators:true,
     useFindAndModify:false,
  })

  res.status(200).json({
     success:true,    
     message:"Update Successfully",
     brand1
  })
})