const express=require('express');
const {
  checkout,
  paymentVerification,GetOrderBySessionIdOrUserId
} = require("../controllers/paymentController.js");

const router=express.Router(); 

router.route("/checkout").post(checkout);

router.route("/paymentverification").post(paymentVerification);
router.route("/GetOrderBySessionIdOrUserId").post(GetOrderBySessionIdOrUserId);

module.exports=router;


 