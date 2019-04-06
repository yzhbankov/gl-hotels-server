const jwt = require('jsonwebtoken');

import * as config from './../../config.json';
const Hotels = require('./');

async function getHotelsHandler(req, res, next) {
    try {
        const uid = req.params.uid;
        const options = {
            limit: req.query.limit ? Number(req.query.limit) : 0,
            offset: req.query.offset ? Number(req.query.offset) : 0,
        };
        if (uid) {
            const hotel = await Hotels.getHotels(uid, {});
            if (!hotel) {
                res.status(404).send('Hotel not found');
            }
            res.status(200).send(hotel.hotel);
        } else {
            const hotels = await Hotels.getHotels(null, options);
            res.status(200).send(hotels);
        }
    } catch (err) {
        next(err);
    }
}

async function createHotelHandler(req, res, next) {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
        const hotel = {
            hotel: req.body.hotel ? req.body.hotel : {},
            preview: '',
            title: req.body.title ? req.body.title : '',
            email: decoded.email,
        };
        const newHotel = await Hotels.createHotel(hotel);
        res.status(200).send(newHotel);
    } catch (err) {
        next(err);
    }
}

async function removeHotelsHandler(req, res, next) {
    try {
        const uid = req.params.uid;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
        const spec = await Hotels.removeHotel(uid, decoded.email);
        res.status(204).send(spec);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getHotelsHandler,
    createHotelHandler,
    removeHotelsHandler,
};
