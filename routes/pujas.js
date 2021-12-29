
const express = require("express");
const router = express.Router();

const Puja = require("../models/puja");


//INDEX ROUTE - shows all the puja entries
router.get('/', (req, res) => {
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
router.post('/', (req,res) => {
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
router.get('/new', (req, res) => {
    res.render('pujas/new');
});

//SHOW - show more info about one Puja entry
router.get("/:id", (req,res)=> {

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

module.exports = router;