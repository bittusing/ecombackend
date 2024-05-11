const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const agentSchema = new mongoose.Schema({
  agent_name: {
    type: String,
    required: [true, "Please enter the agent name"],
    trim: true
  },
  agent_email: {
    type: String,
    required: [true, "Please enter the agent email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  },
  agent_mobile: {
    type: String,
    trim: true,
    unique: true // Assuming agent_mobile should be unique
  },
  agent_password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Minimum 6 characters required for the password"],
    select: false
  },
  role: {
    type: String,
    default: "user"
  },
  agent_role: {
    type: String,
    default: "sales",
  },
  profile_image: {
    type: String,
  },
  company_name: {
    type: String,
  },
  gstno: {
    type: String,
  },
  pimg: {
    type: String,
  },
  agent_status: {
    type: Number,
    default: 1,
  },
  client_access: {
    type: String,
    default: "no",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Convert password to bcrypt hash before saving
agentSchema.pre("save", async function (next) {
  if (!this.isModified("agent_password")) {
    return next();
  }
  this.agent_password = await bcrypt.hash(this.agent_password, 10);
  next();
});

// Generate JWT Token
agentSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "5d",
  });
};

// Compare Password
agentSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.agent_password);
};

// Generate Password Reset Token
agentSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("crm_agent", agentSchema);
