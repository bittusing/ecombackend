const Slider=require('../models/sliderModal'); 
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");



// create lost reason

exports.addslider=catchAsyncErrors(async (req,res,next)=>{

          const slider=await Slider.create(req.body);

          res.status(201).json({
           success: true,
           slider,
         });  
})

// Delete lost reason

exports.deleteslider=catchAsyncErrors(async (req,res,next)=>{

   const slider=await Slider.findById(req.params.id);

   if(!slider){
     return next(new ErrorHander("slider is not found",404));
   }

   await slider.deleteOne();   

   res.status(201).json({
     success:true,
     message:"Deleated Successfully",
     slider,
   }) 
   
}) 

// get All lost reason
exports.getAllSlider=catchAsyncErrors(async(req,res,next)=>{
         const slider=await Slider.find();

         res.status(200).json({
           success:true,
           slider
         })
})

////  update Lost Reason 

exports.updateSlider=catchAsyncErrors(async (req,res,next)=>{
     
     const slider=await Slider.findById(req.params.id);  

     if(!slider){
       return next(new ErrorHander("slider is not found",404));
     }

    const  slider1=await Slider.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
     })

     res.status(200).json({
        success:true,
        slider1
     })
})