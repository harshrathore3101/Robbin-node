const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// mongoose.connect("mongodb://localhost/mohit1");

const userschema = mongoose.Schema({
  // name: String,
  username: String,
  password: Number,
  number: Number,
  email: String,
});

userschema.plugin(plm);
module.exports = mongoose.model("user", userschema);
