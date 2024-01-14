const express = require("express");
const app = express();
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const mongoose = require("mongoose");
const {isLoggedIn, isOwner} = require("../middleWares/isLoggedIn");
const ExpressError = require("../utils/ExpressError");
const {listingSchema , reviewSchema} = require("../schema"); //server Side validation schema;
const listingController = require("../controller/listing");
const multer  = require('multer')
const {storage} = require("../cloudconfig");
const upload = multer({ storage}) // multer will save the file in a folder named uploads; dest stands for destination;


const listingObj = require("../models/listing");
const Listing = mongoose.model("Listing" , listingObj);
const Review = require("../models/review");



const validateListing =(req,res,next)=>{
    let {err} = listingSchema.validate(req.body); //To cosider the schema validation on the server side we are using joi (note that we have already consider the clint side schema validation)
    if(err){
        throw new ExpressError(400, result.err);
    }
    else next();
}


//get request for the home page
router.get("/" ,wrapAsync(listingController.showListings))


//get request fot creating new listing
router.get("/new", isLoggedIn , (req,res)=>{ // if we write this below the get request of listings/:id then it will consider "new" as an id in listings/id;
    res.render("listings/new.ejs")
})


//get request for veiwing the listing in details
router.get("/:id",wrapAsync(listingController.showListingDetails))


//post request to save the new data of new listing;
router.post("/", isLoggedIn ,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing))


//get request to edit the listing of given id;
router.get("/:id/edit",isOwner , isLoggedIn , wrapAsync(listingController.renderEditListing))


//patch request to update the new data of listing;
router.patch("/:id",isOwner,upload.single("listing[image]"),validateListing, isLoggedIn,wrapAsync(listingController.updateListing))


//Deltet request for deleteing listing of given id
router.delete("/:id",isOwner, isLoggedIn , wrapAsync(listingController.destroyListing))

module.exports = router;
