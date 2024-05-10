const mongoose = require("mongoose");

const agentAddressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    mobile: {
      type: Number,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    Country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    pincode: {
      type: Number,
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("agentAddress", agentAddressSchema);
