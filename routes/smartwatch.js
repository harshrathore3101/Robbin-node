const mongoose = require("mongoose");
// const plm = require("passport-local-mongoose");

// mongoose.connect("mongodb://localhost/mohit");

const smartwatchschema = mongoose.Schema({
  type: String,
  hotsell: String,
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
  ///////////////////
  // airpod: String,
  color: String,
  headponeType: String,
  InlineRemote: String,
  SalesPackage: String,
  Connectivity: String,
  HeadphoneDesign: String,
  //////////////////////
  //Analog watch
  Material:String,
  Brand: String,
  CalenderType : String,
  CaseMaterial: String,
  Clasp: String,
  DisplayType: String,
  CaseShap: String,
  SpecialFeatures: String,
  ///////////////////////
  // other
  BatteryCapacity: String,
  NetQuantity: String,
  ItemDimensions: String,
  ///////////////////////
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  //////////////////////
  img1: String,
  img2: String,
  img3: String,
  img4: String,
  img5: String,
});

// adminschema.plugin(plm);
module.exports = mongoose.model("smartwatch", smartwatchschema);
