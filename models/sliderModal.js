const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    slider_name: {
      type: String,
      trim: true,
    },
    image:{
      type: String,
        trim: true,
    },
    image_name:{
      type: String,
        trim: true,
    },
    imagefor:{
      type: String,
        trim: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("slider", sliderSchema);
