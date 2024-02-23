const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    subcategory: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId type
      ref: 'category', // Reference to the 'category' collection
      required:[true,"Please Enter category Mobile"],     
      // trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("subcategory", subcategorySchema);
