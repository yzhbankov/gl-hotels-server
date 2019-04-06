import * as Joi from 'joi';

const weather = Joi.object().keys({
    temperature: Joi.number().required(),
    wind: Joi.number().required(),
    icon: Joi.string().required(),
});


const profile = Joi.object().keys({
    followers: Joi.number().required(),
    following: Joi.number().required(),
    photo: Joi.string().required(),
});

const createHotel = Joi.object().keys({
    address: Joi.string().required(),
    description: Joi.string().required(),
    phone: Joi.string().required(),
    picture: Joi.string().required(),
    photos: Joi.array().items(Joi.string()),
    weather: weather.required(),
    profile: profile.required(),
    stars: Joi.number().required(),
});

const updateHotel = Joi.object().keys({
    address: Joi.string().optional(),
    description: Joi.string().optional(),
    phone: Joi.string().optional(),
    picture: Joi.string().optional(),
    photos: Joi.array().items(Joi.string()).optional(),
    weather: weather.optional(),
    profile: profile.optional(),
    stars: Joi.number().optional(),
});

module.exports = {
    createHotel,
    updateHotel
};
