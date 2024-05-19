const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    password: String,
    is_verified:Number,
    userType: String,
  },
  {
    collection: "User",
  }
);

mongoose.model("User", UserDetailsScehma);