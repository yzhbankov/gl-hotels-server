"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jwt = require('jsonwebtoken');
const config = require("./../../config.json");
const Hotels = require('./');
function getHotelsHandler(req, res, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.params.uid;
            const options = {
                limit: req.query.limit ? Number(req.query.limit) : 0,
                offset: req.query.offset ? Number(req.query.offset) : 0,
            };
            if (uid) {
                const hotel = yield Hotels.getHotels(uid, {});
                if (!hotel) {
                    res.status(404).send('Hotel not found');
                }
                res.status(200).send(hotel);
            }
            else {
                const hotels = yield Hotels.getHotels(null, options);
                res.status(200).send(hotels);
            }
        }
        catch (err) {
            next(err);
        }
    });
}
function createHotelHandler(req, res, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
            const hotel = Object.assign({}, req.body);
            const newHotel = yield Hotels.createHotel(hotel, decoded.email);
            res.status(200).send(newHotel);
        }
        catch (err) {
            next(err);
        }
    });
}
function updateHotelHandler(req, res, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
            const hotel = Object.assign({}, req.body);
            const uid = req.params.uid;
            const newHotel = yield Hotels.updateHotel(uid, hotel, decoded.email);
            res.status(200).send(newHotel);
        }
        catch (err) {
            next(err);
        }
    });
}
function removeHotelsHandler(req, res, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.params.uid;
            const token = req.headers.authorization;
            const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
            const hotel = yield Hotels.removeHotel(uid, decoded.email);
            res.status(204).send(hotel);
        }
        catch (err) {
            next(err);
        }
    });
}
module.exports = {
    getHotelsHandler,
    createHotelHandler,
    removeHotelsHandler,
    updateHotelHandler,
};
//# sourceMappingURL=handlers.js.map