const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const  {saveRedirectUrl } = require("../middleWares/isLoggedIn");
const userController = require("../controller/user");
const user = require("../models/user");

router.get("/signup",userController.renderSignUp);


router.post("/signup",wrapAsync(userController.signUp))
router.get("/login",(req,res)=>{
    res.render("./users/login.ejs")
})


router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureFlash:true , failureRedirect : "/login"}), // passport.authenticate is a middleware to check whether the user with given username and password exits or not
    userController.login
)


router.get("/logout",userController.logOut);

module.exports = router;
