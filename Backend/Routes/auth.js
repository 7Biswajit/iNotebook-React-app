const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Biswaisagoodb$oy";

// Route 1:Create a User user :POST "/api/auth/createUser".No login required

router.post(
  "/createUser",
  [
    body("name").isLength({ min: 5 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors return bad request

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // check whether the email is exist already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "sorry a user with same email is already is exsit" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //Create a new user

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      
      const authtoken = jwt.sign(data, JWT_SECRET);

      //res.json(user)
      success=true;
      res.json({ success,authtoken });


    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route 2: Authenicate a User user :POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "enter a valid mail").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors return bad request

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({email});
      if (!user) {
        success = false
        return res
          .status(400)
          .json({
            error: "plaese try to login with correct correct credentials",
          });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
    res.json({ success, authtoken })
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal server error");
    }
  }
)
//Route 3: Get loggedin User Details Using:POST "/api/auth/getuser".login required
router.post(
  "/getuser",fetchuser, async (req, res) => {
    try {
      userId=req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal server error");
    }});
module.exports = router;
