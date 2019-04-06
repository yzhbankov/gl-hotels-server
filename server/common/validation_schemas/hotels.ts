import * as Joi from 'joi';

const weather = Joi.object().keys({
    temperature: Joi.number().required(),
    wind: Joi.number().required(),
    icon: Joi.string().required(),
});


const profile = Joi.object().keys({
    followers: Joi.number().required(),
    following: Joi.number().required(),
    photo: Joi.binary().encoding('base64').min(10).required(),
});

const createHotel = Joi.object().keys({
    address: Joi.string().required(),
    description: Joi.string().required(),
    phone: Joi.string().required(),
    picture: Joi.binary().encoding('base64').min(10).required(),
    photos: Joi.array().items(Joi.binary().encoding('base64').min(10)),
    weather: weather.required(),
    profile: profile.required(),
    stars: Joi.number().required(),
});

const updateHotel = Joi.object().keys({
    address: Joi.string().optional(),
    description: Joi.string().optional(),
    phone: Joi.string().optional(),
    picture: Joi.binary().encoding('base64').min(10).optional(),
    photos: Joi.array().items(Joi.binary().encoding('base64').min(10)).optional(),
    weather: weather.optional(),
    profile: profile.optional(),
    stars: Joi.number().optional(),
});

module.exports = {
    createHotel,
    updateHotel
};
