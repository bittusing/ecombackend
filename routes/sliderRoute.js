// const express=require('express');
// const { addslider ,deleteslider , getAllSlider,updateSlider} = require('../controllers/sliderController');
// const  router=express.Router();
// router.route("/addslider").post(addslider);   
// router.route("/deleteslider/:id").delete(deleteslider);
// router.route("/getAllSlider").get(getAllSlider);
// router.route("/updateSlider/:id").put(updateSlider);
// module.exports=router;
const express=require('express');
const  slider=express();
const multer = require('multer');
const path=require('path');
const fs = require('fs');
const destinationPath = path.join(__dirname, '../public');
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath, { recursive: true });
}
slider.use(express.static(path.resolve(__dirname,'../public')));
var storage= multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null, destinationPath);
    },
    filename:(req,file,cb)=>{
         cb(null, Date.now() + '-' + file.originalname);
    }
})
// Multer file filter configuration
function fileFilter(req, file, cb) {
  const allowedFileTypes = ['png', 'jpg']; // Update allowed file types
  const fileExtension = path.extname(file.originalname).toLowerCase().replace('.', '');
 if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only png,jpg files are allowed.'), false);
  }
}
var upload = multer({ storage: storage, limits: {
  fileSize: 5 * 1024 * 1024 // 5MB limit (adjust as needed)
}, fileFilter: fileFilter });
const  sliderController=require('../controllers/sliderController'); 
slider.post('/api/v1/addslider',upload.single('image'),sliderController.addslider);     
slider.get('/api/v1/getAllSlider',sliderController.getAllSlider); 
slider.get('/api/v1/getAllSliderMobile',sliderController.getAllSliderMobile); 
slider.get('/api/v1/getAllSliderss',sliderController.getAllSliderss);
slider.delete('/api/v1/deleteslider/:id',sliderController.deleteslider);
slider.put('/api/v1/updateSlider/:id',upload.single('image'),sliderController.updateSlider);
module.exports=slider;

