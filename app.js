const express           = require("express");
const app               = express();
const bodyParser        = require("body-parser");
const port              = process.env.PORT || 8080;
const methodOverride    = require("method-override");
const flash             = require("connect-flash");
const seedDB            = require("./seeds");

//Authentication imports
const passport          = require("passport");
const LocalStrategy     = require("passport-local"); 

//seed the database
// seedDB();



//Integrating mongoDB
const mongoose   = require("mongoose");
// User model
const User       = require("./models/user");


//requiring routes
const commentRoutes = require("./routes/comments");
const pujasRoutes   = require("./routes/pujas");
const indexRoutes    = require("./routes/index");
const req = require("express/lib/request");

const url = "mongodb+srv://swarnavo:1iDJnz6SRnFXNFTC@cluster0.cg6jj.mongodb.net/FestEveCloud?retryWrites=true&w=majority"
mongoose.connect(url, {useNewUrlParser: true});
require('dotenv').config()

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

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


//middleware for accessing current User to all routes
app.use((req, res, next)=> {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.primary = req.flash("primary");
    next();
});


app.use("/",indexRoutes);
app.use("/pujas", pujasRoutes);
app.use("/pujas/:id/comments/", commentRoutes);



app.listen(port, () => {
    console.log('FestEve Server started.')
});