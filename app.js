const express    = require("express");
const app        = express();
const bodyParser = require("body-parser");
const port       = process.env.PORT || 8080;
const seedDB     = require("./seeds");

//Authentication imports
const passport          = require("passport");
const LocalStrategy     = require("passport-local"); 
seedDB();



//Integrating mongoDB
const mongoose   = require("mongoose");
const Puja       = require("./models/puja");
const Comment    = require("./models/comment");
// User model
const User       = require("./models/user");




mongoose.connect("mongodb://localhost/FestEve");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "FestEve is gonna blowup!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//INDEX ROUTE - shows all the puja entries
app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/pujas', (req, res) => {
    //get all pujas from DB
    Puja.find({}, (err, allPujas) => {
        if(err){
            console.log(err);
        } else {
            res.render('pujas/index', {pujas: allPujas});
        }
    })
   
});

//CREATE ROUTE - to create a new puja entry
app.post('/pujas', (req,res) => {
    // res.send('YOU HIT THE POST ROUTE');

    //get data from form and add to places array
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newPuja = {name: name, image : image, description : desc };
    //Create a new Puja and save to DB
    Puja.create(newPuja, (err, Newpuja) =>  {
        if(err) {
            console.log(err);
        } else {
            //redirect back to places page
            res.redirect('/pujas');
        }
    })

    
});

//NEW - show form to create new puja entry
app.get('/pujas/new', (req, res) => {
    res.render('pujas/new');
});

//SHOW - show more info about one Puja entry
app.get("/pujas/:id", (req,res)=> {

    //find the puja with provided Id and show to puja.
    Puja.findById(req.params.id).populate("comments").exec((err,foundPuja)=> {
        if(err) {
            console.log(err);
        } else {
            console.log(foundPuja);
            res.render("pujas/show", {puja: foundPuja});
        }

    });

});


// ============================
//COMMENTS ROUTES
// ============================

app.get("/pujas/:id/comments/new",isLoggedIn, (req, res)=> {
    //find puja by id
    Puja.findById(req.params.id, (err, puja)=> {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {puja: puja})
        }
    })

});

app.post("/pujas/:id/comments",isLoggedIn, (req, res) => {
    //lookup pujas using ID
    Puja.findById(req.params.id, (err, puja)=> {
        if(err) {
            console.log(err);
            res.redirect("/pujas")
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                if(err) {
                    console.log(err);
                } else {
                    puja.comments.push(comment);
                    puja.save();
                    res.redirect("/pujas/" + puja._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to puja
    //redirect puja show page
});

//===================
//AUTH ROUTES
//===================

//show register form 
app.get("/register", (req,res)=> {
    res.render("register");
});

//handle sign up logic
app.post("/register", (req, res)=> {
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
app.get("/login", (req, res)=> {
    res.render("login");
});

//handle login logic
//middleware used here
app.post("/login", passport.authenticate("local", {
    successRedirect : "/pujas",
    failureRedirect: "/login"
}), (req, res)=> {});


//logout route
app.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/pujas");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



app.listen(port, () => {
    console.log('FestEve Server started.')
});