const mongoose = require("mongoose");
// const plm = require("passport-local-mongoose");

// mongoose.connect("mongodb://localhost/mohit");

const smartwatchschema = mongoose.Schema({
  name: String,
  price: Number,
  DialColour: String,
  DialShape: String,
  StrapColor: String,
  StrapMaterial: String,
  Size: String,
  TouchScreen: String,
  WaterResistant: String,
  WaterResistanceDepth: String,
  Usage: String,
  Idealfor: String,
  Sensor: String,
  CompatibleDevice: String,
  Notification: String,
  NotificationType: String,
  BatteryLife: String,
  CallFunction: String,
  Bluetooth: String,
  CalorieCount: String,
  HeartRateMonitor: String,
  StepCount: String,
  Otherfeatures: String,
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },

  img1: String,
  img2: String,
  img3: String,
  img4: String,
  img5: String,
});

// adminschema.plugin(plm);
module.exports = mongoose.model("smartwatch", smartwatchschema);
