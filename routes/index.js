var express = require("express");
var router = express.Router();
// const adminmodel = require("./admin");
const smartwatchmodel = require("./smartwatch");
const passport = require("passport");
const localstrategy = require("passport-local");
const multer = require("multer");
const usermodel = require("./users");
const fs = require("fs");

// passport.use(new localstrategy(adminmodel.authenticate()));
passport.use(new localstrategy(usermodel.authenticate()));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const unique =
      Date.now() + Math.round(Math.random() * 10000) + `${file.originalname}`;
    cb(null, unique);
  },
});
// console.log(file);

const upload = multer({ storage: storage });

/* GET home page. */
router.get("/", function (req, res, next) {
  smartwatchmodel.find().then(function (data) {
    res.render("index", { data });
    // res.send(data);
  });
});

router.get("/index", isloggedin, function (req, res) {
  usermodel
    .findOne({
      username: req.session.passport.user,
    })
    .then(function (user) {
      smartwatchmodel.find().then(function (data) {
        res.render("logindex", { data, user });
      });
    });
});

router.get("/info/:id", function (req, res) {
  smartwatchmodel.findOne({ _id: req.params.id }).then(function (prd) {
    smartwatchmodel.find().then(function (data) {
      res.render("info", { prd, data });
    });
    // res.send(prd);
  });
});

router.get("/loginfo/:id", isloggedin, function (req, res) {
  usermodel
    .findOne({
      username: req.session.passport.user,
    })
    .then(function (user) {
      smartwatchmodel
        .findOne({
          _id: req.params.id,
        })
        .then(function (prd) {
          smartwatchmodel.find().then(function (data) {
            // var added;
            // if (user.product.indexOf(prd._id) !== -1) {
            //   added = true;
            // } else {
            //   added = false;
            // }
            res.render("loginfo", { user, prd, data });
          });
        });
    });
});

router.get("/card", isloggedin, function (req, res) {
  usermodel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("product")
    .then(function (value) {
      usermodel
        .findOne({
          username: req.session.passport.user,
        })
        .then(function (user) {
          res.render("card", { value, user });
        });
      // res.send(data);
    });
});

router.get("/card/:plc", isloggedin, function (req, res) {
  usermodel
    .findOne({
      username: req.session.passport.user,
    })
    .then(function (user) {
      smartwatchmodel
        .findOne({
          _id: req.params.plc,
        })
        .then(function (foundprd) {
          // console.log(foundprd);
          if (user.product.indexOf(foundprd._id) === -1) {
            user.product.push(foundprd._id);
          } else {
            var place = user.product.indexOf(foundprd._id);
            // console.log(place);
            user.product.splice(place, 1);
          }
          user.save().then(function () {
            res.redirect(req.headers.referer);
            // res.json();
            // res.end;
          });
        });
    });
});

// router.get("/removecard/:plc", isloggedin, function (req, res) {
//   usermodel
//     .findOne({
//       username: req.session.passport.user,
//     })
//     .then(function (user) {
//       smartwatchmodel
//         .findOne({
//           _id: req.params.plc,
//         })
//         .then(function (prd) {
//           var place = user.product.indexOf(prd._id);
//           console.log(place);
//           user.product.splice(place, 1);
//         });
//       user.save().then(function () {
//         res.redirect(req.headers.referer);
//       });
//     });
// });

///////////////////////////////////////////////////////////////////////
///// User login

router.post("/register", function (req, res, next) {
  var newUser = new usermodel({
    email: req.body.email,
    number: req.body.number,
    username: req.body.username,
    admin: req.body.admin,
    login: "yes",
  });
  usermodel
    .register(newUser, req.body.password)
    .then(function (u) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/createprd");
      });
    })
    
    .catch(function (err) {
      res.send(err)
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/createprd",
    failureRedirect: "/gotologin",
  })
);

router.get("/createprd", isloggedin, function (req, res) {
  var loged = req.session.passport.user;
  usermodel
    .findOne({
      username: loged,
    })
    .then(function (data) {
      if (data.admin === "true") {
        res.redirect("/prdform");
      } else {
        res.redirect("/index");
      }
    });
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/prdform", isloggedin, function (req, res) {
  res.render("prdform");
});

function isloggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/gotologin");
  }
}

////////////////////////////////////////////////////////////////////////
/// Admin login

router.get("/summi", function (req, res) {
  res.render("adminlogin");
});

// router.post("/adminregister", function (req, res) {
//   var newuser = new adminmodel({
//     name: req.body.name,
//     username: req.body.username,
//   });
//   adminmodel
//     .register(newuser, req.body.password)
//     .then(function (u) {
//       passport.authenticate("local")(req, res, function () {
//         res.redirect("/prdform");
//       });
//     })
//     .catch(function (e) {
//       res.send(e);
//     });
// });

// router.post(
//   "/adminlogin",
//   passport.authenticate("local", {
//     successRedirect: "/prdform",
//     failureRedirect: "/summi",
//   })
// );

// router.get("/adminlogout", function (req, res) {
//   req.logout();
//   res.redirect(req.headers.referer);
// });

// function islog(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.redirect("/summi");
//     // res.send("Not for yous");
//   }
// }

//////////////////////////////////////////////////////////////////
/////User login

router.get("/gotologin", function (req, res) {
  res.render("login");
});

//////////////////////////////////////////////////////////////////
///// create productss

router.post(
  "/smartwatch",
  isloggedin,
  upload.array("uploadedfile",5),
  function (req, res) {
    usermodel
      .findOne({
        username: req.session.passport.user,
      })
      .then(function (logadmin) {
        smartwatchmodel
          .create({
            hotsell: req.body.hotsell,
            type: req.body.type,
            name: req.body.name,
            price: req.body.price,
            DialColour: req.body.DialColour,
            DialShape: req.body.DialShape,
            StrapColor: req.body.StrapColor,
            StrapMaterial: req.body.StrapMaterial,
            Size: req.body.Size,
            TouchScreen: req.body.TouchScreen,
            WaterResistant: req.body.WaterResistant,
            WaterResistanceDepth: req.body.WaterResistanceDepth,
            Usage: req.body.Usage,
            Idealfor: req.body.Idealfor,
            Sensor: req.body.Sensor,
            CompatibleDevice: req.body.CompatibleDevice,
            Notification: req.body.Notification,
            NotificationType: req.body.NotificationType,
            BatteryLife: req.body.BatteryLife,
            CallFunction: req.body.CallFunction,
            Bluetooth: req.body.Bluetooth,
            CalorieCount: req.body.CalorieCount,
            HeartRateMonitor: req.body.HeartRateMonitor,
            StepCount: req.body.StepCount,
            Otherfeatures: req.body.Otherfeatures,
            // img1: req.files[0].filename,
            // img2: req.files[1].filename,
            // img3: req.files[2].filename,
            // img4: req.files[3].filename,
            // img5: req.files[4].filename,
            ///////////////////////////////////
            // airpod
            color: req.body.color,
            headponeType: req.body.headponeType,
            InlineRemote: req.body.InlineRemote,
            SalesPackage: req.body.SalesPackage,
            Connectivity: req.body.Connectivity,
            HeadphoneDesign: req.body.HeadphoneDesign,
            //////////////////////////////////////
            // analog
            Material: req.body.Material,
            CalenderType: req.body.CalenderType,
            CaseMaterial: req.body.CaseMaterial,
            Clasp: req.body.Clasp,
            DisplayType: req.body.DisplayType,
            CaseShap: req.body.CaseShap,
            SpecialFeatures: req.body.SpecialFeatures,

            /////////////////////////////////////
            //other
            BatteryCapacity: req.body.BatteryCapacity,
            NetQuantity: req.body.NetQuantity,
            ItemDimensions: req.body.ItemDimensions,
            ////////////////////////////////////
            // Images
            img1: {
              data: fs.readFileSync(req.files[0].path).toString("base64"),
              contentType: req.files[0].mimetype,
            },
            img2: {
              data: fs.readFileSync(req.files[1].path).toString("base64"),
              contentType: req.files[1].mimetype,
            },
            img3: {
              data: fs.readFileSync(req.files[2].path).toString("base64"),
              contentType: req.files[2].mimetype,
            },
            img4: {
              data: fs.readFileSync(req.files[3].path).toString("base64"),
              contentType: req.files[3].mimetype,
            },
            img5: {
              data: fs.readFileSync(req.files[4].path).toString("base64"),
              contentType: req.files[4].mimetype,
            },
          })
          .then(function (createdprd) {
            logadmin.product.push(createdprd._id);
            logadmin.save().then(function () {
              // res.send(req.files);
              res.redirect("/prdform");
            });
          });
      });
  }
);

router.get("/buy/:id", isloggedin, function (req, res) {
  smartwatchmodel
    .findOne({
      _id: req.params.id,
    })
    .then(function (data) {
      res.redirect(
        `https://api.whatsapp.com/send?phone=916232414369&text=I%20want%20to%20buy%20:%20"${data.name}"%20,%20Price%20:%20"${data.price}"`
      );
    });
});

router.get("/editprd", isloggedin, function (req, res) {
  smartwatchmodel.find().then(function (data) {
    res.render("editprd", { data });
  });
});

router.get("/updateprdpage/:plc", isloggedin, function (req, res) {
  smartwatchmodel
    .findOne({
      _id: req.params.plc,
    })
    .then(function (prd) {
      res.render("updateprdad", { prd });
    });
});

router.post("/updateprd/:plc", isloggedin, function (req, res) {
  smartwatchmodel
    .findOneAndUpdate(
      {
        _id: req.params.plc,
      },
      {
        hotsell: req.body.hotsell,
        name: req.body.name,
        price: req.body.price,
        DialColour: req.body.DialColour,
        DialShape: req.body.DialShape,
        StrapColor: req.body.StrapColor,
        StrapMaterial: req.body.StrapMaterial,
        Size: req.body.Size,
        TouchScreen: req.body.TouchScreen,
        WaterResistant: req.body.WaterResistant,
        WaterResistanceDepth: req.body.WaterResistanceDepth,
        Usage: req.body.Usage,
        Idealfor: req.body.Idealfor,
        Sensor: req.body.Sensor,
        CompatibleDevice: req.body.CompatibleDevice,
        Notification: req.body.Notification,
        NotificationType: req.body.NotificationType,
        BatteryLife: req.body.BatteryLife,
        CallFunction: req.body.CallFunction,
        Bluetooth: req.body.Bluetooth,
        CalorieCount: req.body.CalorieCount,
        HeartRateMonitor: req.body.HeartRateMonitor,
        StepCount: req.body.StepCount,
        Otherfeatures: req.body.Otherfeatures,
        ////////////////////////////////////////////////
        color: req.body.color,
        headponeType: req.body.headponeType,
        InlineRemote: req.body.InlineRemote,
        SalesPackage: req.body.SalesPackage,
        Connectivity: req.body.Connectivity,
        HeadphoneDesign: req.body.HeadphoneDesign,
        SpecialFeatures: req.body.SpecialFeatures,
        ///////////////////////////////////////////////
        Material: req.body.Material,
        CalenderType: req.body.CalenderType,
        CaseMaterial: req.body.CaseMaterial,
        Clasp: req.body.Clasp,
        DisplayType: req.body.DisplayType,
        CaseShap: req.body.CaseShap,
        /////////////////////////////////////////////////
      }
    )
    .then(function () {
      res.redirect("/");
    });
});

router.get("/deleteprd/:plc", isloggedin, function (req, res) {
  smartwatchmodel
    .findOneAndDelete({
      _id: req.params.plc,
    })
    .then(function () {
      res.redirect("/");
    });
});

router.post("/contact", function (req, res) {
  res.redirect("/");
});

router.get("/home",function(req,res){
  res.redirect("/")
})

router.get("/loghome", function (req, res) {
  res.redirect("/index");
});
module.exports = router;
