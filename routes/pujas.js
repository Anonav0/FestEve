
const express = require("express");
const router = express.Router();

const Puja = require("../models/puja");

const middleware = require("../middleware/index")


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
router.post('/', middleware.isLoggedIn, (req,res) => {
    // res.send('YOU HIT THE POST ROUTE');

    //get data from form and add to places array
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newPuja = {name: name, image : image, description : desc , author: author};
    //Create a new Puja and save to DB
    Puja.create(newPuja, (err, Newpuja) =>  {
        if(err) {
            console.log(err);
        } else {
            //redirect back to places page
            console.log(Newpuja)
            res.redirect('/pujas');
        }
    })

    
});

//NEW - show form to create new puja entry
router.get('/new',middleware.isLoggedIn, (req, res) => {
    res.render('pujas/new');
});

//SHOW - show more info about one Puja entry
router.get("/:id", (req,res)=> {

    //find the puja with provided Id and show to puja.
    Puja.findById(req.params.id).populate("comments").exec((err,foundPuja)=> {
        if(err || !foundPuja) {
            req.flash("error", "Puja entry not found! :(");
            res.redirect("back");
            console.log(err);
        } else {
            console.log(foundPuja);
            res.render("pujas/show", {puja: foundPuja});
        }

    });

});

//EDIT PUJA ROUTE
router.get("/:id/edit",middleware.checkPujaOwnership, (req, res)=> {

    Puja.findById(req.params.id, (err, foundPuja)=> {

        res.render("pujas/edit", {puja : foundPuja});
    });

});

//UPDATE PUJA ROUTE
router.put("/:id", middleware.checkPujaOwnership, (req,res)=> {
    //find and update the correct puja
    Puja.findByIdAndUpdate(req.params.id, req.body.puja, (err, updatedPuja) => {
        if(err) {
            res.redirect("/pujas");
        } else {
            
            res.redirect("/pujas/"+ req.params.id);
           
        }
    })
    //redirect
});

//DESTORY PUJA ROUTE  
router.delete("/:id", middleware.checkPujaOwnership, (req,res)=> {
    Puja.findByIdAndRemove(req.params.id, (err)=> {
        if(err) {
            res.redirect("/pujas");
        } else {
            res.redirect("/pujas");
        }
    })
});





module.exports = router;
