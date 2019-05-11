import * as  error from 'http-errors';
import * as _Has from 'lodash.has';

const db = require('./../../db');
const ObjectId = require('mongodb').ObjectID;
const { SEARCH } = require( '../common/constants');

const Users = require('./../users');
import { IHotel, IUser } from '../common/models';

async function createHotel(hotel, authorEmail) {
    try {
        const hotelsCollection = db.get().collection('hotels');
        const now: Date = new Date();

        const currentUser: IUser = await Users.findUserByEmailOrUid(authorEmail);
        if (!currentUser) {
            throw error(404, 'User not found');
        }

        const result = await hotelsCollection.insertOne({
            hotel,
            createdBy: {
                email: currentUser.email
            },
            createdAt: now,
            updatedAt: now,
        });
        const createdHotel: IHotel = result.ops[0];

        const currentUserHotels: string[] = currentUser.hotels ? currentUser.hotels : [];
        const updatedUserHotels: string[] = [...currentUserHotels, createdHotel._id];
        await Users.setHotelsToUser(authorEmail, updatedUserHotels);

        return result.ops[0];
    } catch (err) {
        throw err;
    }
}

async function updateHotel(uid, hotel, authorEmail) {
    try {
        const hotelsCollection = db.get().collection('hotels');
        const now: Date = new Date();

        const currentUser: IUser = await Users.findUserByEmailOrUid(authorEmail);
        if (!currentUser) {
            throw error(404, 'User not found');
        }
        const oldHotel = await hotelsCollection.findOne({ _id: ObjectId(uid) });
        if (!oldHotel) {
            console.error('Updated hotel not found');
            throw error(422, 'Updated hotel not found')
        }
        const updatedHotel = Object.assign({}, oldHotel.hotel, hotel);
        await hotelsCollection.updateOne(
            { _id: ObjectId(uid) },
            {
                $set: {
                    hotel: updatedHotel, updatedAt: now
                }
            },
        );
        return await hotelsCollection.findOne({ _id: ObjectId(uid) });
    } catch (err) {
        throw err;
    }
}

async function increaseHotelFollowers(uid) {
    try {
        const hotelsCollection = db.get().collection('hotels');
        const now: Date = new Date();

        const oldHotel = await hotelsCollection.findOne({ _id: ObjectId(uid) });
        if (!oldHotel) {
            console.error('Updated hotel not found');
            throw error(422, 'Updated hotel not found')
        }
        if (_Has(oldHotel, 'hotel.profile.followers')) {
            oldHotel.hotel.profile.followers += 1;
        }

        const updatedHotel = Object.assign({}, oldHotel.hotel);
        await hotelsCollection.updateOne(
            { _id: ObjectId(uid) },
            {
                $set: {
                    hotel: updatedHotel, updatedAt: now
                }
            },
        );
        return await hotelsCollection.findOne({ _id: ObjectId(uid) });
    } catch (err) {
        throw err;
    }
}

async function removeHotel(uid: string, email: string) {
    try {
        const hotelsCollection = db.get().collection('hotels');
        const hotelExist: IHotel = await hotelsCollection.findOne({ _id: ObjectId(uid), 'createdBy.email': email });
        const user: IUser = await Users.findUserByEmailOrUid(email);
        if (!hotelExist || !user) {
            throw error(404, 'Hotel or user not exist');
        }
        await hotelsCollection.deleteOne({ _id: ObjectId(uid), 'createdBy.email': email });
        const updatedUserHotels: string[] = user.hotels.filter(hotel => ObjectId(hotel).toString() !== ObjectId(uid).toString());
        await Users.setHotelsToUser(email, updatedUserHotels);
    } catch (err) {
        throw err;
    }
}

async function getHotels(uid = null, { offset = 0, limit = SEARCH.LIMIT }) {
    const hotelsCollection = db.get().collection('hotels');
    if (!uid) {
        return await hotelsCollection.find({ })
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 })
            .toArray();
    }

    return await hotelsCollection.findOne({ _id: ObjectId(uid) });
}

module.exports = {
    createHotel,
    updateHotel,
    removeHotel,
    getHotels,
    increaseHotelFollowers,
};
