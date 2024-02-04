const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
    {
        subcategory: {
          type: String,
          trim: true,
        } 
      },
  {
    category: {
        type: mongoose.Schema.ObjectId,
        required:[true,"Please Enter Category"],
         trim: true,
    } 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("subcategory", subcategorySchema);
