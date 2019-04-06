const jwt = require('jsonwebtoken');

import * as config from './../../config.json';
const Hotels = require('./');
import { IHotel } from '../common/models';

async function getHotelsHandler(req, res, next) {
    try {
        const uid: string = req.params.uid;
        const options = {
            limit: req.query.limit ? Number(req.query.limit) : 0,
            offset: req.query.offset ? Number(req.query.offset) : 0,
        };
        if (uid) {
            const hotel: IHotel = await Hotels.getHotels(uid, {});
            if (!hotel) {
                res.status(404).send('Hotel not found');
            }
            res.status(200).send(hotel);
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
        const token: string = req.headers.authorization;
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
        const hotel = { ...req.body };

        const newHotel: IHotel = await Hotels.createHotel(hotel, decoded.email);
        res.status(200).send(newHotel);
    } catch (err) {
        next(err);
    }
}

async function removeHotelsHandler(req, res, next) {
    try {
        const uid: string = req.params.uid;
        const token: string = req.headers.authorization;
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
        const hotel: IHotel = await Hotels.removeHotel(uid, decoded.email);
        res.status(204).send(hotel);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getHotelsHandler,
    createHotelHandler,
    removeHotelsHandler,
};
