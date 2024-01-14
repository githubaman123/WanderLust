const mongoose = require("mongoose");
const listingObj = require("../models/listing");
const Listing = mongoose.model("Listing" , listingObj);
const Review = require("../models/review");


module.exports.isLoggedIn = (req,res,next)=>{ //This is a middelware to check if the user is logged in or not in case the user in not logged in we are storing the Original path ( so that user can retrun back after the login) and we are rendering the login page;
    // console.log(req);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You are not logged in. Login Here!");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{ // we are storing the redirectUrl in the locals because session.autenticate function will reset the session parameter once the user the authenticated;
    if(req.session.redirectUrl){
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
    }
        
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(`${id}`);
    if(res.locals.currUser && res.locals.currUser._id.equals(listing.owner._id)){
        return next();
    }
    else{
        req.flash("error","You are not the owner");
        res.redirect(`/listings/${id}`)
    }
}
module.exports.isReviewAuthor= async (req,res,next)=>{
    let {reviewId,id} = req.params;
    let review =await Review.findById(`${reviewId}`);
    if(res.locals.currUser && res.locals.currUser._id.equals(review.author._id) ){ 
        next();
    }
    else{
        req.flash("error","You are not the author of this review");
        res.redirect(`/listings/${id}`)
    }
}