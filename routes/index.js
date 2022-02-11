
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
    res.render("register", {page: 'register'});
});

//handle sign up logic
router.post("/register", (req, res)=> {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, usr)=> {
        if(err) {
            console.log(err);
            return res.render("register", {error: err.message});
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
    res.render("login",{page:'login'});
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