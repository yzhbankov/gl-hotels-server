"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const addFavorite = Joi.object().keys({
    hotelId: Joi.string().required(),
});
module.exports = {
    addFavorite
};
//# sourceMappingURL=favorites.js.map