import * as  error from 'http-errors';
const db = require('./../../db');
const ObjectId = require('mongodb').ObjectID;
const { SEARCH } = require( '../common/constants');

const { findUserByEmailOrUid, setHotelsToUser } = require('./../users/handlers');

function formatHotel(hotel) {
    return {
        id: hotel._id,
        title: hotel.title,
        preview: hotel.preview,
        author: {
            login: hotel.createdBy.login,
        },
    };
}

async function createHotel({ hotel, title, email, preview }) {
    try {
        const hotelsCollection = db.get().collection('hotels');
        const now = new Date();

        const currentUser = await findUserByEmailOrUid(email);
        if (!currentUser) {
            throw error(404, 'User not found');
        }

        const result = await hotelsCollection.insert({
            hotel,
            title,
            createdBy: {
                email, login: currentUser.email
            },
            preview,
            createdAt: now,
            updatedAt: now,
        });
        const createdHotel = result.ops[0];


        const currentUserHotels = currentUser.hotels ? currentUser.hotels : [];
        const updatedUserHotels = [...currentUserHotels, createdHotel._id];
        await setHotelsToUser(email, updatedUserHotels);

        return result.ops[0];
    } catch (err) {
        throw err;
    }
}

async function removeHotel(uid, email) {
    try {
        const hotelsCollection = db.get().collection('hotels');
        const hotelExist = await hotelsCollection.findOne({ _id: ObjectId(uid), 'createdBy.email': email });
        const user = await findUserByEmailOrUid(email);
        if (!hotelExist || !user) {
            throw error(404, 'Hotel or user not exist');
        }
        await hotelsCollection.deleteOne({ _id: ObjectId(uid), 'createdBy.email': email });
        const updatedUserHotels = user.hotels.filter(hotel => ObjectId(hotel).toString() !== ObjectId(uid).toString());
        await setHotelsToUser(email, updatedUserHotels);
    } catch (err) {
        throw err;
    }
}

async function getHotels(uid = null, { offset = 0, limit = SEARCH.LIMIT }) {
    const hotelsCollection = db.get().collection('hotels');
    if (!uid) {
        const hotels = await hotelsCollection.find({ })
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 })
            .toArray();

        return hotels.map(spec => formatHotel(spec));
    }

    return await hotelsCollection.findOne({ _id: ObjectId(uid) });
}

module.exports = {
    createHotel,
    removeHotel,
    getHotels,
};
