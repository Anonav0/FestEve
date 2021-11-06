const express    = require("express");
const app        = express();
const bodyParser = require("body-parser");
const port       = process.env.PORT || 8080;
const seedDB     = require("./seeds");

seedDB();

//Integrating mongoDB
const mongoose   = require("mongoose");
const Puja       = require("./models/puja");




mongoose.connect("mongodb://localhost/FestEve");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");




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
            res.render('index', {pujas: allPujas});
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
    res.render('new.ejs');
});

//SHOW - show more info about one Puja entry
app.get("/pujas/:id", (req,res)=> {

    //find the puja with provided Id and show to puja.
    Puja.findById(req.params.id).populate("comments").exec((err,foundPuja)=> {
        if(err) {
            console.log(err);
        } else {
            console.log(foundPuja);
            res.render("show", {puja: foundPuja});
        }

    });

});




app.listen(port, () => {
    console.log('FestEve Server started.')
});