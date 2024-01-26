const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      trim: true,
    } 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("category", categorySchema);
