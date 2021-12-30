const express = require("express");
const router = express.Router({mergeParams: true});

const Puja = require("../models/puja");
const Comment = require("../models/comment");


//comments new
router.get("/new",isLoggedIn, (req, res)=> {
    //find puja by id
    Puja.findById(req.params.id, (err, puja)=> {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {puja: puja})
        }
    })

});

//comments create
router.post("/",isLoggedIn, (req, res) => {
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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    puja.comments.push(comment);
                    puja.save();
                    console.log(comment);
                    res.redirect("/pujas/" + puja._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to puja
    //redirect puja show page
});


//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;