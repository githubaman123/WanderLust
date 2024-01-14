const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const {listingSchema , reviewSchema} = require("../schema"); //server Side validation schema;
const Review = require("../models/review");
const listingObj = require("../models/listing");
const { isLoggedIn, isReviewAuthor } = require("../middleWares/isLoggedIn");
const Listing = mongoose.model("Listing" , listingObj);
const reviewController = require("../controller/review");

const validateReview =(req,res,next)=>{
    let {err} = listingSchema.validate(req.body); //To cosider the schema validation on the server side we are using joi (note that we have already consider the clint side schema validation)
    if(err){
        throw new ExpressError(400, result.err);
    }
    else next();
}

//Delete request for delteting listing review with given id
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));


//accept post request to add review for an id;
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.addReview));

module.exports = router;