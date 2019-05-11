"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const error = require("http-errors");
const _Has = require("lodash.has");
const db = require('./../../db');
const ObjectId = require('mongodb').ObjectID;
const { SEARCH } = require('../common/constants');
const Users = require('./../users');
function createHotel(hotel, authorEmail) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const hotelsCollection = db.get().collection('hotels');
            const now = new Date();
            const currentUser = yield Users.findUserByEmailOrUid(authorEmail);
            if (!currentUser) {
                throw error(404, 'User not found');
            }
            const result = yield hotelsCollection.insertOne({
                hotel,
                createdBy: {
                    email: currentUser.email
                },
                createdAt: now,
                updatedAt: now,
            });
            const createdHotel = result.ops[0];
            const currentUserHotels = currentUser.hotels ? currentUser.hotels : [];
            const updatedUserHotels = [...currentUserHotels, createdHotel._id];
            yield Users.setHotelsToUser(authorEmail, updatedUserHotels);
            return result.ops[0];
        }
        catch (err) {
            throw err;
        }
    });
}
function updateHotel(uid, hotel, authorEmail) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const hotelsCollection = db.get().collection('hotels');
            const now = new Date();
            const currentUser = yield Users.findUserByEmailOrUid(authorEmail);
            if (!currentUser) {
                throw error(404, 'User not found');
            }
            const oldHotel = yield hotelsCollection.findOne({ _id: ObjectId(uid) });
            if (!oldHotel) {
                console.error('Updated hotel not found');
                throw error(422, 'Updated hotel not found');
            }
            const updatedHotel = Object.assign({}, oldHotel.hotel, hotel);
            yield hotelsCollection.updateOne({ _id: ObjectId(uid) }, {
                $set: {
                    hotel: updatedHotel, updatedAt: now
                }
            });
            return yield hotelsCollection.findOne({ _id: ObjectId(uid) });
        }
        catch (err) {
            throw err;
        }
    });
}
function increaseHotelFollowers(uid) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const hotelsCollection = db.get().collection('hotels');
            const now = new Date();
            const oldHotel = yield hotelsCollection.findOne({ _id: ObjectId(uid) });
            if (!oldHotel) {
                console.error('Updated hotel not found');
                throw error(422, 'Updated hotel not found');
            }
            if (_Has(oldHotel, 'hotel.profile.followers')) {
                oldHotel.hotel.profile.followers += 1;
            }
            const updatedHotel = Object.assign({}, oldHotel.hotel);
            yield hotelsCollection.updateOne({ _id: ObjectId(uid) }, {
                $set: {
                    hotel: updatedHotel, updatedAt: now
                }
            });
            return yield hotelsCollection.findOne({ _id: ObjectId(uid) });
        }
        catch (err) {
            throw err;
        }
    });
}
function removeHotel(uid, email) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const hotelsCollection = db.get().collection('hotels');
            const hotelExist = yield hotelsCollection.findOne({ _id: ObjectId(uid), 'createdBy.email': email });
            const user = yield Users.findUserByEmailOrUid(email);
            if (!hotelExist || !user) {
                throw error(404, 'Hotel or user not exist');
            }
            yield hotelsCollection.deleteOne({ _id: ObjectId(uid), 'createdBy.email': email });
            const updatedUserHotels = user.hotels.filter(hotel => ObjectId(hotel).toString() !== ObjectId(uid).toString());
            yield Users.setHotelsToUser(email, updatedUserHotels);
        }
        catch (err) {
            throw err;
        }
    });
}
function getHotels(uid = null, { offset = 0, limit = SEARCH.LIMIT }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const hotelsCollection = db.get().collection('hotels');
        if (!uid) {
            return yield hotelsCollection.find({})
                .skip(offset)
                .limit(limit)
                .sort({ createdAt: -1 })
                .toArray();
        }
        return yield hotelsCollection.findOne({ _id: ObjectId(uid) });
    });
}
module.exports = {
    createHotel,
    updateHotel,
    removeHotel,
    getHotels,
    increaseHotelFollowers,
};
//# sourceMappingURL=index.js.map