const express=require('express');
const {
  checkout,
  paymentVerification,GetOrderBySessionIdOrUserId,createShipments,getTrackingDetails
} = require("../controllers/paymentController.js");

const router=express.Router(); 

router.route("/checkout").post(checkout);

router.route("/paymentverification").post(paymentVerification);
router.route("/GetOrderBySessionIdOrUserId").post(GetOrderBySessionIdOrUserId);
router.route("/createShipments").post(createShipments);
router.route("/getTrackingDetails").post(getTrackingDetails); 

module.exports=router;


 