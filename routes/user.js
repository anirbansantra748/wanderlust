const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middlewire.js");
const userControler = require("../controllers/users.js");

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Route to render the signup form Route to handle user registratio
router
  .route("/signup")
  .get(userControler.signuprout)
  .post(wrapAsync(userControler.signup));

// Route to render the login form Route to handle user login
router
  .route("/login")
  .get(userControler.loginrout)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControler.login
  );

//logout rout
router.get("/logout", userControler.logout);

module.exports = router;
