if (process.env.NODE_ENV != "production"){  // This is ensure that in the deployment phase we should not revele aur credentials on the github;
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
var methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session')
const MongoStore = require('connect-mongo');

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const UserRouter = require("./routes/user");

const atlasUrl = process.env.ATLAS_URL;
main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));
async function main() {
    await mongoose.connect(atlasUrl);
}

app.use(express.urlencoded({extended:true}));
app.set("view engine" , "ejs");
app.use(methodOverride('_method'))
app.set("views" , path.join(__dirname , "/views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

const storObj = MongoStore.create({
    mongoUrl : atlasUrl, // to store session information on atlas
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600
})


let sessionObj = {
    store : storObj,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
}

app.use(flash());
app.use(session(sessionObj));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //It will authenticate the user based on local strategy we can aslo use google based strategy if we want user to log in via google;
passport.serializeUser(User.serializeUser()); //It will serialize the user into the session after the login and add all the user information till the user is not logged out;
passport.deserializeUser(User.deserializeUser()); //It will deserialize the user after the user has looged out;



app.use((req,res,next)=>{  //this is a middle ware to add any message of a flash(which appears only once) in the local variables of the next page which is going to be rendered
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
}) // Also write this middleware before routing



app.use("/" , UserRouter);
app.use("/listings",listingRouter); //These the routes;
app.use("/listings/:id/reviews",reviewRouter);

app.get("*" , (req,res,next)=>{
    next(new ExpressError(404 , "Page not found"));
})
app.use((err,req,res,next)=>{
    let {statusCode=505 , message="Some error occured"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
})

app.listen(8080 , ()=>{
    console.log("server is listening");
})
















