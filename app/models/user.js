// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  online: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
