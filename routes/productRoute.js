const express=require('express');
const { addproduct ,deleteproduct , getAllproduct,updateproduct} = require('../controllers/productController');



const  router=express.Router();

router.route("/addproduct").post(addproduct);   
router.route("/deleteproduct/:id").delete(deleteproduct);
router.route("/getAllproduct").get(getAllproduct);
router.route("/updateproduct/:id").put(updateproduct);
 

module.exports=router;