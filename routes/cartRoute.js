const express=require('express');

const { addCart ,deleteaddcart,getAllCartBySessionId } = require('../controllers/cartControllers');
const {getAllwishlistByUserId,deleteaddwishlist,addWishlist}=require('../controllers/wishlistController');

const router=express.Router();
  
router.route("/deleteaddcart").delete(deleteaddcart); 
router.route("/addCart").post(addCart); 
router.route("/getAllCartBySessionId").post(getAllCartBySessionId); 

router.route("/deleteaddwishlist").delete(deleteaddwishlist); 
router.route("/addWishlist").post(addWishlist);   
router.route("/getAllwishlistByUserId").post(getAllwishlistByUserId); 

 
module.exports=router;     