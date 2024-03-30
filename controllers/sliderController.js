const Slider=require('../models/sliderModal'); 
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require('fs'); // Add this line to import the fs module
const path = require('path'); // Import the path module

// create lost reason

exports.addslider = catchAsyncErrors(async (req, res, next) => {
  try {
      let imagePath;
      if (req.file) {
       
          imagePath = req.file.path;
          image_name  =req.file.filename;
      }
    // If imagePath is undefined, you may want to handle it appropriately
      const sliderData = { ...req.body, image: imagePath,image_name:image_name};
     const slider = await Slider.create(sliderData);
      res.status(201).json({
          success: true,
          slider,
      });
  } catch (error) {
      next(error); // Pass the error to the error handling middleware
  }
});

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
         const slider=await Slider.find({imagefor:"Desktop"});

         res.status(200).json({
           success:true,
           slider
         })
})

exports.getAllSliderMobile=catchAsyncErrors(async(req,res,next)=>{
  const slider=await Slider.find({imagefor:"Mobile"});

  res.status(200).json({
    success:true,
    slider
  })
})


/// get all  getAllSliderss
exports.getAllSliderss=catchAsyncErrors(async(req,res,next)=>{
  const slider=await Slider.find();

  res.status(200).json({
    success:true,
    slider
  })
});
////  update Lost Reason 

exports.updateSlider = catchAsyncErrors(async (req, res, next) => {
  const slider = await Slider.findById(req.params.id);

  if (!slider) {
    return next(new ErrorHander("Slider is not found", 404));
  }

  if (req.file) {
    const imagePath = path.join(slider.image);
    // Check if the file exists before attempting deletion
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the file from the filesystem
    } else {
      console.log("File does not exist:", imagePath);
    }

    req.body.image = req.file.path;
  }

  const slider1 = await Slider.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    slider1
  });
});
