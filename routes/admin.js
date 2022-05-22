const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/mohit");

const adminschema = mongoose.Schema({
  name: String,
  username: String,
  password: Number,
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "smartwatch",
    },
  ],
});

adminschema.plugin(plm);
module.exports = mongoose.model("admin", adminschema);
