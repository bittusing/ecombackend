const Product = require('../models/productModel');
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const category = require("../models/categoryModel");
const { ObjectId } = require('mongoose').Types;
const fs = require('fs'); // Add this line to import the fs module
const path = require('path');
const Review = require('../models/reviewModel');
// create lost reason

exports.addproduct = catchAsyncErrors(async (req, res, next) => {
  try {
    let images1 = [];
    if (req.files) {
      // Iterate over the keys of req.files
      Object.keys(req.files).forEach(key => {
        // For each key, iterate over the array of files associated with that key
        req.files[key].forEach(file => {
          images1.push({
            image_name: file.filename,
            url: file.path
          });
        });
      });
    }



    const Data = {
      ...req.body,
      images: images1 // Assign the images array to the images field
    };

    const product = await Product.create(Data);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
});



// Delete lost reason

exports.deleteproduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("product is not found", 404));
  }
  await product.deleteOne();
  res.status(201).json({
    success: true,
    message: "Deleated Successfully",
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
exports.getAllproduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
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
      $lookup: {
        from: "subcategories",
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
      $lookup: {
        from: "brands",
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
    success: true,
    product
  })
});

////get getAllproductbyid 
exports.getAllproductbyid = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("product is not found", 404));
  }
  res.status(201).json({
    success: true,
    product,
  })
});

////  update Lost Reason 

exports.updateproduct1 = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("product is not found", 404));
  }
  const product1 = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
  res.status(200).json({
    success: true,
    message: "Product Update Successfully",
    product1
  })
})

exports.updateproduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("Product is not found", 404));
    }
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    let images = product.images || []; 

    if (req.files) {
      Object.keys(req.files).forEach((key) => {
       req.files[key].forEach((file) => {
          images.push({
            image_name: file.filename,
            url: file.path,
          });
        });
      });
    }
   product.images = images;  
   const updatedProduct = await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});



/////  Add Review of Product 
exports.AddRevied = catchAsyncErrors(async (req, res, next) => {
  const { product_id, name, rating, title, comment } = req.body;
  
  // Check if product_id is provided
  if (!product_id) {
    return next(new ErrorHander("Product ID is required", 404));
  }

  // Find the product
  const product = await Product.findById(product_id);
  
  // Check if product exists
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Create a new review using the request body data
  const review = await Review.create({
    product_id,
    name,
    rating,
    title,
    comment
  });

  // Send response
  res.status(201).json({
    success: true,
    message: 'Review added successfully.',
    review,
  });
});


// get Product Review 
exports.getAllReviews = async (req, res, next) => {
  try {
  
    const reviews = await Review.find({ product_id:req.params.id });

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};







