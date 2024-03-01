const express=require('express');
const { addCategory ,deletecategory , getAllcategory,updateCategory
,updatesubCategory,getAllsubcategory ,deletesubcategory ,addsubcategory
,addbrand ,deletebrand ,getAllbrand ,updatebrand,getsubcategory,getSubcategoryByCategoryId
} = require('../controllers/categoryController');



const  router=express.Router();

router.route("/addCategory").post(addCategory);   
router.route("/deletecategory/:id").delete(deletecategory);
router.route("/getAllcategory").get(getAllcategory);
router.route("/updateCategory/:id").put(updateCategory);

///////////////subcategory route
router.route("/addsubcategory").post(addsubcategory);   
router.route("/getSubcategoryByCategoryId").post(getSubcategoryByCategoryId);
router.route("/deletesubcategory/:id").delete(deletesubcategory);
router.route("/getAllsubcategory").get(getAllsubcategory);
router.route("/getsubcategory").get(getsubcategory);
router.route("/updatesubCategory/:id").put(updatesubCategory);

////////////// Brand Route 
router.route("/addbrand").post(addbrand);   
router.route("/deletebrand/:id").delete(deletebrand);
router.route("/getAllbrand").get(getAllbrand);
router.route("/updatebrand/:id").put(updatebrand);

module.exports=router;