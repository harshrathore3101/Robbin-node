var mongoose = require("mongoose");
var plm = require("passport-local-mongoose");

mongoose.connect(
  "mongodb+srv://mohit123:mohit123@mohit.tjed4.mongodb.net/?retryWrites=true&w=majority"
);

var userschema = mongoose.Schema({
  email: String,
  number: Number,
  password: String,
  username: String,
  admin: String,
  login: String,
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "smartwatch",
    },
  ],
});
userschema.plugin(plm);

module.exports = mongoose.model("user", userschema);


// git add .
// git commit -m "message"
// git push heroku master