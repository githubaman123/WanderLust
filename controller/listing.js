const mongoose = require("mongoose");
const Review = require("../models/review");
const listingObj = require("../models/listing");
const Listing = mongoose.model("Listing" , listingObj);

module.exports.showListings = async (req,res)=>{
    req.session.redirectUrl = req.originalUrl;
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}

module.exports.showListingDetails = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(`${id}`)
    .populate({
        path : "reviews",
        populate : {
            path : "author",
        }
    })
    .populate("owner");
    res.render("listings/show.ejs" , {listing});
};

module.exports.renderEditListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(`${id}`);
    res.render("listings/edit.ejs",{listing});
}

module.exports.createNewListing = async (req,res)=>{
    let url = req.file.path; //To get the path of the uploaded image;
    let filename = req.file.filename; //To get the filename of the uploaded image;
    let listing =new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url , filename};
    await listing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.updateListing = async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400 , "Send valid data for listing")
    }
    let {id}= req.params;
    let newListing =req.body.listing;
    let listing = await Listing.findByIdAndUpdate(`${id}`,newListing);
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing =async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(`${id}`);
    if(listing.reviews.length >0){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
    await Listing.findByIdAndDelete(`${id}`);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}




