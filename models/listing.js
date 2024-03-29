const mongoose = require("mongoose");

const listingSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    image : {
        url : String,
        filename : String
    },
    price : {
        type : Number,
    },
    location : {
        type : String,
    },
    country : {
        type : String,
    },
    reviews:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});



module.exports = listingSchema;
