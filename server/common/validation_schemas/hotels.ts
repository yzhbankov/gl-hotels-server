import * as Joi from 'joi';

const weather = Joi.object().keys({
    temperature: Joi.number().required(),
    wind: Joi.number().required(),
    icon: Joi.string().required(),
}).required();


const profile = Joi.object().keys({
    followers: Joi.number().required(),
    following: Joi.number().required(),
    photo: Joi.string().required(),
}).required();

const createHotel = Joi.object().keys({
    address: Joi.string().required(),
    description: Joi.string().required(),
    phone: Joi.string().required(),
    picture: Joi.string().required(),
    photos: Joi.array().items(Joi.string()),
    weather: weather,
    profile: profile,
    stars: Joi.number().required(),
});

module.exports = {
    createHotel
};
