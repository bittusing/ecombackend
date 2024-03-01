const express=require('express');
const { addproduct ,deleteproduct , getAllproduct,updateproduct
     ,getAllproductbyid
    ,BulkProductDelete} = require('../controllers/productController');



const  router=express.Router();

router.route("/addproduct").post(addproduct);   
router.route("/deleteproduct/:id").delete(deleteproduct);
router.route("/getAllproduct").get(getAllproduct);
router.route("/getAllproductbyid/:id").get(getAllproductbyid);
router.route("/updateproduct/:id").put(updateproduct);
router.route("/BulkProductDelete").delete(BulkProductDelete);
 

module.exports=router;