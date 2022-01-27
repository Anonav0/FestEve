const Puja = require("../models/puja");
const Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj ={};

middlewareObj.checkPujaOwnership = (req,res, next)=> {

    //if user is logged in
    if(req.isAuthenticated()) {
        
        Puja.findById(req.params.id, (err, foundPuja)=> {
            if(err) {
                req.flash("error", "Puja Entry not found! :(");
                res.redirect("back");
            }else {
                //does the user own the puja entry?
                 if(foundPuja.author.id.equals(req.user._id)) {
                    next();
                 } else {
                     req.flash("error", "You don't have permission to do that! :(")
                     res.redirect("back");
                 }
                
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = (req,res, next) => {

    //if user is logged in
    if(req.isAuthenticated()) {
        
        Comment.findById(req.params.comment_id, (err, foundComment)=> {
            if(err) {
                res.redirect("back");
            }else {
                //does user own the comment?
                 if(foundComment.author.id.equals(req.user._id)) {
                    next();
                 } else {
                     req.flash("error", "You don't have permission to do that!")
                     res.redirect("back");
                 }
                
            }
        });
    } else {
        req.flash("error", "You need to be Logged in to do that! :(")
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}


module.exports = middlewareObj;