const express = require("express");
const router = express.Router({mergeParams: true});

const Puja = require("../models/puja");
const Comment = require("../models/comment");

const middleware = require("../middleware/index");


//comments new
router.get("/new", middleware.isLoggedIn, (req, res)=> {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
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

//COMMENTS EDIT ROUTE 
router.get("/:comment_id/edit",middleware.checkCommentOwnership, (req, res)=> {
    Comment.findById(req.params.comment_id, (err, foundComment)=> {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {puja_id: req.params.id, comment: foundComment});
        }
    });
    
});

//COMMENT UPDATE
router.put("/:comment_id", (req,res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            
            res.redirect("back");
        } else {
            res.redirect("/pujas/"+ req.params.id);
        }
    })
});

//COMMENT DESTORY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, (req, res)=> {
    Comment.findByIdAndRemove(req.params.comment_id, (err)=> {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/pujas/"+ req.params.id);
        }
    } )
})






module.exports = router;