
const express = require("express");
const router = express.Router();

const passport = require("passport");
const user = require("../models/user");
const User = require("../models/user");


//root route
router.get('/', (req, res) => {
    res.render('landing');
});


//show register form 
router.get("/register", (req,res)=> {
    res.render("register");
});

//handle sign up logic
router.post("/register", (req, res)=> {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, usr)=> {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, ()=> {
            req.flash("success", "Welcome to FestEve! "+ newUser.username);
            res.redirect("/pujas");
        });
    });
});

//login route
//show login form
router.get("/login", (req, res)=> {
    res.render("login");
});

//handle login logic
//middleware used here
router.post("/login", passport.authenticate("local", {
    successRedirect : "/pujas",
    failureRedirect: "/login"
}), (req, res)=> {});


//logout route
router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/pujas");
});



module.exports = router;