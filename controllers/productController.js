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
/////////for review 
exports.BulkProductReviewDelete = catchAsyncErrors(async (req, res, next) => {
  const leadIds = req.body.ids;

  const result = await Review.deleteMany({ _id: { $in: leadIds } });
  res.status(200).json({
    success: true,
    message: "Review Has Been Deleted",
  });
});



// get All lost reason

exports.getAllproduct = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.aggregate([ 
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
    },
  
  ]);
    for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const reviews = await Review.find({ product_id: product._id });
    const totalReviews = reviews.length;
    let totalRating = 0;
   for (const review of reviews) { 
      totalRating += review.rating;
    }
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
    product.totalReviews = totalReviews;
    product.averageRating = averageRating;
  }

  res.status(200).json({
    success: true,
    product:products
  });
});




////get getAllproductbyid 
exports.getAllproductbyid = catchAsyncErrors(async (req, res, next) => {
  // Fetch the product by ID
  const product = await Product.findById(req.params.id);
  
  // If product is not found, return an error
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  
  // Fetch reviews associated with the product
  // const reviews = await Review.find({ product_id:req.params.id && approved:1});  
  const reviews = await Review.find({ product_id: req.params.id, approved: 1 });
  // Calculate totalReviews and averageRating
  const totalReviews = reviews?.length;
  const totalRating = reviews?.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

  // Add totalReviews and averageRating to the product object
  product.totalReviews = totalReviews;
  product.averageRating = parseFloat(averageRating); // Convert averageRating to a float

  
  
  // Send response with the product data
  res.status(200).json({
    success: true,
    product,
  });
});


////update product review 
exports.updateproductreview = catchAsyncErrors(async (req, res, next) => {
  const { product_id, name, rating, title, comment, _id ,approved} = req.body;

  if (!product_id || !_id) {
    return res.status(400).json({
      success: false,
      message: 'Product ID and review ID are required.',
    });
  }

  // Find the product by ID
  const product = await Product.findById(product_id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.',
    });
  }

  // Find the review by ID
  const reviews = await Review.findById(_id);

  if (!reviews) {
    return res.status(404).json({
      success: false,
      message: 'Review not found.',
    });
  }
  let images =  []; 

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
  // Update the review fields
  if (name) reviews.name = name;
  if (rating) reviews.rating = rating;
  if (title) reviews.title = title;
  if (comment) reviews.comment = comment;
  if (approved) reviews.approved = approved;
  if (images) reviews.images = images;
  
  // Save the updated product
  await reviews.save();

  res.status(200).json({
    success: true,
    message: 'Review updated successfully.',
    reviews,
  });
});


////  update Lost Reason 


exports.updateproduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("Product is not found", 404));
    }
    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.Stock = req.body.Stock || product.Stock;
    product.weightwishprice = req.body.weightwishprice || product.weightwishprice;
    product.subcategory = req.body.subcategory || product.subcategory;
    product.description = req.body.description || product.description;
    product.ProductOverviewDiscription = req.body.ProductOverviewDiscription || product.ProductOverviewDiscription;
    product.SupplimentFacts = req.body.SupplimentFacts || product.SupplimentFacts;
    product.sku = req.body.sku || product.sku;
    product.metaDes = req.body.metaDes || product.metaDes;
    product.metaKey = req.body.metaKey || product.metaKey;
    product.metaTitle = req.body.metaTitle || product.metaTitle;
    product.UPCCode = req.body.UPCCode || product.UPCCode;
    product.ProductCode = req.body.ProductCode || product.ProductCode;
    product.bestbefore = req.body.bestbefore || product.bestbefore;
 
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
  const { product_id, name, rating, title, comment  } = req.body;
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

  let images =  []; 

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
 
  // Create a new review using the request body data
  const review = await Review.create({
    product_id,
    name,
    rating,
    title,
    comment,
    images:images,
  });

  // Send response
  res.status(201).json({
    success: true,
    message: 'Review added successfully.',
    review,
  });
});




// get Product Review for web
exports.getAllReviews = async (req, res, next) => {
  try {
  
    // const reviews = await Review.find({ product_id:req.params.id , approved: 1 });
    const reviews = await Review.find({ product_id: req.params.id, approved: 1 }).sort({ createdAt: -1 });


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

// get Product Review for admin
exports.getAllReviewsadmin = async (req, res, next) => {
  try {
  
    const reviews = await Review.find({ product_id:req.params.id  });

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


//get perticuler review 
exports.getPerticulerReviews = async (req, res, next) => {
  try {
  
    const reviews = await Review.find({ _id:req.params.id });

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

exports.getAllProductByCategory = async (req, res, next) => {
  try {
    // Find products by category ID
    const products = await Product.find({ category: req.params.id });

    // Check if products exist
    if (!products || products.length === 0) {
      return next(new ErrorHander("Products not found", 404));
    }

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const reviews = await Review.find({ product_id: product._id });
      const totalReviews = reviews.length;
      let totalRating = 0;
     for (const review of reviews) { 
        totalRating += review.rating;
      }
      const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
      product.totalReviews = totalReviews;
      product.averageRating = averageRating;
    }

    // Send response with products
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
};


exports.getAllProductBySubCategory = async (req, res, next) => {
  try {
    // Find products by category ID
    const products = await Product.find({ subcategory: req.params.id });

    // Check if products exist
    if (!products || products.length === 0) {
      return next(new ErrorHander("Products not found", 404));
    }

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const reviews = await Review.find({ product_id: product._id });
      const totalReviews = reviews.length;
      let totalRating = 0;
     for (const review of reviews) { 
        totalRating += review.rating;
      }
      const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
      product.totalReviews = totalReviews;
      product.averageRating = averageRating;
    }

    // Send response with products
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

exports.getAllProductByBrand = async (req, res, next) => {
  try {
    // Find products by category ID
    const products = await Product.find({ brand: req.params.id });

    // Check if products exist
    if (!products || products.length === 0) {
      return next(new ErrorHander("Products not found", 404));
    }

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const reviews = await Review.find({ product_id: product._id });
      const totalReviews = reviews.length;
      let totalRating = 0;
     for (const review of reviews) { 
        totalRating += review.rating;
      }
      const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
      product.totalReviews = totalReviews;
      product.averageRating = averageRating;
    }

    // Send response with products
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    // Handle errors 
    next(error);
  }
};







