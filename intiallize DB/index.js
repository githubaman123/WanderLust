let data = require("./data.js");
let listingSchema = require("../models/listing.js");
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const Listing = mongoose.model("Listing",listingSchema);


const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("data saved");
}
initDB();



