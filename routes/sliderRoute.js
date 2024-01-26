const express=require('express');
const { addslider ,deleteslider , getAllSlider,updateSlider} = require('../controllers/sliderController');



const  router=express.Router();

router.route("/addslider").post(addslider);   
router.route("/deleteslider/:id").delete(deleteslider);
router.route("/getAllSlider").get(getAllSlider);
router.route("/updateSlider/:id").put(updateSlider);
 

module.exports=router;