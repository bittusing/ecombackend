const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
    {
        brand: {
          type: String,
          trim: true,
        } 
      },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("brand", brandSchema);
