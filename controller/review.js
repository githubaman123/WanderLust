const mongoose = require("mongoose");
const Review = require("../models/review");
const listingObj = require("../models/listing");
const Listing = mongoose.model("Listing" , listingObj);


module.exports.destroyReview = async (req,res)=>{
    let {id} = req.params;
    let {reviewId} = req.params;
    let listing = await Listing.findById(`${id}`);
    await Review.deleteOne({_id : reviewId});
    await listing.updateOne({_id : id} , {$pull : {reviews : reviewId}});
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}

module.exports.addReview = async(req,res)=>{ //validateReview is a middleware for server side validation; isLoggedIn checks whether the user is lggoed in or not
    let {id} = req.params;
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.currUser._id; // not that we have defined a middleware in app.js which will stor the current User data in the res.locals
    let listing = await Listing.findById(`${id}`);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Added!")
    res.redirect("/listings/"+id);
};