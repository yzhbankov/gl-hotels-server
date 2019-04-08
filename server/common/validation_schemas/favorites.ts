import * as Joi from 'joi';

const addFavorite = Joi.object().keys({
    hotelId: Joi.string().required(),
});

module.exports = {
    addFavorite
};
