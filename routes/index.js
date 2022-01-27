
const express = require("express");
const router = express.Router();

const passport = require("passport");
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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, ()=> {
            res.redirect("/pujas");
        });
    });
});

//login route
//show login form
router.get("/login", (req, res)=> {
    res.render("login", {message: req.flash("error")});
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
    res.redirect("/pujas");
});



module.exports = router;