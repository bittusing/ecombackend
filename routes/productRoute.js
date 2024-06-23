const express = require('express');
const product = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const destinationPath = path.join(__dirname, '../public');
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath, { recursive: true });
}
product.use(express.static(path.resolve(__dirname, '../public')));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
function fileFilter(req, file, cb) {
  const allowedFileTypes = ['png', 'jpg']; 
  const fileExtension = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only png, jpg files are allowed.'), false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit (adjust as needed)
  },
  fileFilter: fileFilter
}).fields([
  { name: 'image0', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 }
]);
const  productController=require('../controllers/productController'); 
product.post('/api/v1/addproduct',upload,productController.addproduct);     
product.get('/api/v1/getAllproduct',productController.getAllproduct); 
product.delete('/api/v1/BulkProductDelete',productController.BulkProductDelete); 
product.delete('/api/v1/BulkProductReviewDelete',productController.BulkProductReviewDelete); 
product.delete('/api/v1/deleteproduct/:id',productController.deleteproduct);
product.put('/api/v1/updateproduct/:id',upload,productController.updateproduct);
product.get('/api/v1/getAllproductbyid/:id',productController.getAllproductbyid);
product.post('/api/v1/AddRevied',upload,productController.AddRevied);
product.post('/api/v1/updateproductreview',upload,productController.updateproductreview);
product.get('/api/v1/getAllReviews/:id',productController.getAllReviews); 
product.get('/api/v1/getAllReviewsadmin/:id',productController.getAllReviewsadmin); 
product.get('/api/v1/getPerticulerReviews/:id',productController.getPerticulerReviews); 

//////get All Product by category,subcategory,brand Id 
product.get('/api/v1/getAllProductByCategory/:id',productController.getAllProductByCategory);
product.get('/api/v1/getAllProductBySubCategory/:id',productController.getAllProductBySubCategory);
product.get('/api/v1/getAllProductByBrand/:id',productController.getAllProductByBrand);
module.exports=product;
 