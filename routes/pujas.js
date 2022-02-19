
const express = require("express");
const router = express.Router();

const Puja = require("../models/puja");
require('dotenv').config();

const middleware = require("../middleware/index")

const multer = require('multer');
const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = (req, file, cb) => {
    // accept image files only
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}

const upload = multer( {storage : storage, fileFilter: imageFilter});

const cloudinary = require('cloudinary');
const puja = require("../models/puja");
cloudinary.config({
    cloud_name: 'tom980h',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//INDEX ROUTE - shows all the puja entries
router.get('/', (req, res) => {
    //get all pujas from DB
    Puja.find({}, (err, allPujas) => {
        if(err){
            console.log(err);
        } else {
            res.render('pujas/index', {pujas: allPujas, page: 'pujas'});
        }
    })
   
});

//CREATE ROUTE - to create a new puja entry
router.post('/', middleware.isLoggedIn, upload.single('image'), (req,res) => {
    // res.send('YOU HIT THE POST ROUTE');
    cloudinary.v2.uploader.upload(req.file.path, (err,result) => {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
        //add cloudinary url for the image to the puja object under image property
        req.body.puja.image = result.secure_url ;
        //add image's public id to puja object
        req.body.puja.imageId = result.public_id;
        // add author to the puja entry
        req.body.puja.author = {
            id : req.user._id,
            username: req.user.username
        }
        Puja.create(req.body.puja, (err, Newpuja) =>  {
            if(err) {
                req.flash("error", "Sorry! There was some problem :(")
                console.log(err);
            } else {
                //redirect back to places page
                res.redirect('/pujas');
            }
        });

    });
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
router.put("/:id", middleware.checkPujaOwnership,upload.single('image'), (req,res)=> {
    //find and update the correct puja
    // console.log(req.body.puja)
    Puja.findById(req.params.id,  async (err, updatedPuja) => {
        if(err) {
            console.log(err);
            req.flash("error", "Sorry! There was some problem :(")
            res.redirect("/pujas");
        } else {
            
            if(req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(updatedPuja.imageId);
                    const result = await cloudinary.v2.uploader.upload(req.file.path);
                    updatedPuja.imageId = result.public_id;
                    updatedPuja.image = result.secure_url;
                } catch(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
                
            }
            updatedPuja.name = req.body.puja.name;
            updatedPuja.description = req.body.puja.description;
            updatedPuja.loc = req.body.puja.loc;
            updatedPuja.lat = req.body.puja.lat;
            updatedPuja.lon = req.body.puja.lon;
            updatedPuja.save();
            req.flash("primary", "Puja entry successfully updated");
            res.redirect("/pujas/"+ req.params.id);
           
        }
    })
    //redirect
});

//DESTORY PUJA ROUTE  
router.delete("/:id", middleware.checkPujaOwnership, (req,res)=> {
    Puja.findById(req.params.id, async(err, puja)=> {
        if(err) {
            res.redirect("/pujas");
        } else {
            try {
                await cloudinary.v2.uploader.destroy(puja.imageId);
                puja.remove();
                req.flash('success', 'Puja Deleted');
                res.redirect("/pujas");
            } catch(err) {
                if(err) {
                    req.flash("error", err.message);
                    return res.redirect('back');
                }
            }
        }
    })
});





module.exports = router;
