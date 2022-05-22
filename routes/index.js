var express = require("express");
var router = express.Router();
const adminmodel = require("./admin");
const smartwatchmodel = require("./smartwatch");
const passport = require("passport");
const localstrategy = require("passport-local");
const multer = require("multer");
const usermodel = require("./users");

passport.use(new localstrategy(adminmodel.authenticate()));

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

router.get("/info/:id", function (req, res) {
  smartwatchmodel.findOne({ _id: req.params.id }).then(function (prd) {
    // res.send(prd);
    res.render("info");
  });
});

// router.post("/upload");

///////////////////////////////////////////////////////////////////////
///// User login

// router.get("/summi", function (req, res) {
//   res.render("adminlogin");
// });

router.post("/userregister", function (req, res) {
  var newuser = new usermodel({
    username: req.body.username,
    number: req.body.number,
    email: req.body.email,
  });
  usermodel
    .register(newuser, req.body.password)
    .then(function (u) {
      passport.authenticate("local")(req, res, function () {
        // res.redirect("/prdform");
        res.send("done");
      });
    })
    .catch(function (e) {
      res.send(e);
    });
});

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

////////////////////////////////////////////////////////////////////////
/// Admin login

router.get("/summi", function (req, res) {
  res.render("adminlogin");
});

router.post("/adminregister", function (req, res) {
  var newuser = new adminmodel({
    name: req.body.name,
    username: req.body.username,
  });
  adminmodel
    .register(newuser, req.body.password)
    .then(function (u) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/prdform");
      });
    })
    .catch(function (e) {
      res.send(e);
    });
});

router.post(
  "/adminlogin",
  passport.authenticate("local", {
    successRedirect: "/prdform",
    failureRedirect: "/summi",
  })
);

router.get("/adminlogout", function (req, res) {
  req.logout();
  res.redirect(req.headers.referer);
});

function islog(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/summi");
    // res.send("Not for yous");
  }
}

router.get("/prdform", islog, function (req, res) {
  res.render("prdform");
});
//////////////////////////////////////////////////////////////////
/////User login

router.get("/gotologin", function (req, res) {
  res.render("login");
});

//////////////////////////////////////////////////////////////////
///// create productss

router.post(
  "/smartwatch",
  islog,
  upload.array("uploadedfile"),
  function (req, res) {
    adminmodel
      .findOne({
        username: req.session.passport.user,
      })
      .then(function (logadmin) {
        smartwatchmodel
          .create({
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
            img1: req.files[0].filename,
            img2: req.files[1].filename,
            img3: req.files[2].filename,
            img4: req.files[3].filename,
            img5: req.files[4].filename,
          })
          .then(function (createdprd) {
            logadmin.product.push(createdprd._id);
            logadmin.save().then(function () {
              // res.send(req.files);
              res.redirect("/");
            });
          });
      });
  }
);

module.exports = router;
