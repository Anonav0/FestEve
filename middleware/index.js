const Puja = require("../models/puja");
const Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj ={};

middlewareObj.checkPujaOwnership = (req,res, next)=> {

    //if user is logged in
    if(req.isAuthenticated()) {
        
        Puja.findById(req.params.id, (err, foundPuja)=> {
            if(err) {
                res.redirect("back");
            }else {
                //does the user own the puja entry?
                 if(foundPuja.author.id.equals(req.user._id)) {
                    next();
                 } else {
                     res.redirect("back");
                 }
                
            }
        });
    } else {
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
                     res.redirect("back");
                 }
                
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj;