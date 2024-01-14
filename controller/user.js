const express = require("express");
const User = require("../models/user");


module.exports.renderSignUp = (req,res)=>{
    res.render("./users/signUp.ejs");
}


module.exports.signUp = 
async(req,res)=>{
    try{
        let {username , email,password} = req.body;
        const newUser = new User({email,username});
        const registorUser = await User.register(newUser,password);
        req.login(registorUser , (err)=>{ // This will log in the user immidiately after the sign Up!
            if(err) return next(err);
            else{
                req.flash("success","Welcome New User");
                res.redirect("/listings");
            }
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}



module.exports.login = (req,res)=>{
    req.flash("success" , "Welcome User");
    res.redirect(res.locals.redirectUrl);
} 


module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err) next(err);
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}



