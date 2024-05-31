const express=require('express');

const { addCart ,deleteaddcart,getAllCartBySessionId ,removecartbycartid,DeleteCoupon,ApplyCouponCode,
    getallGenerateCoupon, addCartDecreaseQuantity,GenerateCoupon} = require('../controllers/cartControllers');
const {getAllwishlistByUserId,deleteaddwishlist,addWishlist ,removewishlistbycartid}=require('../controllers/wishlistController');

const router=express.Router();
  
router.route("/deleteaddcart").delete(deleteaddcart); 
router.route("/addCart").post(addCart); 
router.route("/addCartDecreaseQuantity").post(addCartDecreaseQuantity); 
router.route("/removecartbycartid/:id").delete(removecartbycartid); 
router.route("/getAllCartBySessionId").post(getAllCartBySessionId); 

router.route("/removewishlistbycartid/:id").delete(removewishlistbycartid); 
router.route("/deleteaddwishlist").delete(deleteaddwishlist); 
router.route("/addWishlist").post(addWishlist);   
router.route("/getAllwishlistByUserId").post(getAllwishlistByUserId); 


//////coupon
router.route("/GenerateCoupon").post(GenerateCoupon); 
router.route("/getallGenerateCoupon").get(getallGenerateCoupon); 
router.route("/DeleteCoupon/:id").delete(DeleteCoupon); 
router.route("/ApplyCouponCode").post(ApplyCouponCode); 
module.exports=router;     