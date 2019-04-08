const bcrypt = require('bcrypt');
const { hotels } = require('./seeds/hotels');
import { DATES } from '../server/common/constants';
const config = require('../config');

async function seedsToDb(db) {
    const hotelsCollection = db.collection('hotels');
    const hotelsStats = await hotelsCollection.stats();

    if (hotelsStats.size === 0) {
        const now: Date = new Date();

        const insertedHotels = hotels.map(hotel => ({
            hotel,
            createdBy: {
                email: config.email
            },
            createdAt: now,
            updatedAt: now,
        }));

        await hotelsCollection.insertMany(insertedHotels);
        console.log('default hotels created in db')
    }
}

async function createAdmin(db) {
    const usersCollection = db.collection('users');
    const hotelsCollection = db.collection('hotels');
    const usersStats = await usersCollection.stats();

    if (usersStats.size === 0) {
        const now: Date = new Date();
        const saltRounds = 10;

        const hash = await bcrypt.hash(config.password, saltRounds);
        const allHotels = await hotelsCollection.find().toArray();

        const user = {
            email: config.email,
            password: hash,
            createdAt: now,
            updatedAt: now,
            removedAt: new Date(DATES.REMOVED_AT),
            login: config.login,
            firstName: config.firstName,
            lastName: config.lastName,
            hotels: [...allHotels.map(hotel => hotel._id)],
            favorites: []
        };

        await usersCollection.insertOne({ ...user });
        console.log('default user created in db')
    }
}

module.exports = {
    seedsToDb,
    createAdmin,
};
