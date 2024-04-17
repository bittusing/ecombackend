const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema({
  
    order_id: {
        type: String,
    },
    shipment_id: {
        type: String,
    },
    awb_number: {
        type: String,
    },
    courier_id: {
        type: String,
    },
    courier_name: {
        type: String,
    },
    additional_info: {
        type: String,
    },
    payment_type: {
        type: String,
    },
    label: {
        type: String,
    },
    manifest: {
        type: String,
    },
    razorpay_order_id: {
        type: String,
    },
   
});
module.exports = mongoose.model("Shipment", ShipmentSchema);

