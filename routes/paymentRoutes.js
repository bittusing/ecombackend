const express=require('express');
const {
  checkout,
  paymentVerification,GetOrderBySessionIdOrUserId,createShipments,
  getTrackingDetails,GetAllOrder,GetOrderDetails,GetOrderByOrderId
} = require("../controllers/paymentController.js");

const router=express.Router(); 

router.route("/checkout").post(checkout);

router.route("/paymentverification").post(paymentVerification);
router.route("/GetOrderBySessionIdOrUserId").post(GetOrderBySessionIdOrUserId);
router.route("/createShipments").post(createShipments);
router.route("/GetOrderByOrderId/:id").get(GetOrderByOrderId);
router.route("/getTrackingDetails").post(getTrackingDetails); 
router.route("/GetAllOrder").get(GetAllOrder); 
router.route("/GetOrderDetails/:id").get(GetOrderDetails); 

module.exports=router;


 