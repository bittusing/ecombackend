const express=require('express');
const { addCategory ,deletecategory , getAllcategory,updateCategory} = require('../controllers/categoryController');



const  router=express.Router();

router.route("/addCategory").post(addCategory);   
router.route("/deletecategory/:id").delete(deletecategory);
router.route("/getAllcategory").get(getAllcategory);
router.route("/updateCategory/:id").put(updateCategory);
 

module.exports=router;