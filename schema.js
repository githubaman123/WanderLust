const Joi = require('joi');
//Server Side review Schema for server side validation;
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        type: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        locaiton: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null),

    }).required()
})
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
})