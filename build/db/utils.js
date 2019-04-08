"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt = require('bcrypt');
const Hotels = require("./seeds/hotels.json");
const constants_1 = require("../server/common/constants");
const config = require('../config');
const { hotels } = Hotels;
function seedsToDb(db) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const hotelsCollection = db.collection('hotels');
        const hotelsStats = yield hotelsCollection.stats();
        if (hotelsStats.size === 0) {
            const now = new Date();
            const insertedHotels = hotels.map(hotel => ({
                hotel,
                createdBy: {
                    email: config.email
                },
                createdAt: now,
                updatedAt: now,
            }));
            yield hotelsCollection.insertMany(insertedHotels);
            console.log('default hotels created in db');
        }
    });
}
function createAdmin(db) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const usersCollection = db.collection('users');
        const hotelsCollection = db.collection('hotels');
        const usersStats = yield usersCollection.stats();
        if (usersStats.size === 0) {
            const now = new Date();
            const saltRounds = 10;
            const hash = yield bcrypt.hash(config.password, saltRounds);
            const allHotels = yield hotelsCollection.find().toArray();
            const user = {
                email: config.email,
                password: hash,
                createdAt: now,
                updatedAt: now,
                removedAt: new Date(constants_1.DATES.REMOVED_AT),
                login: config.login,
                firstName: config.firstName,
                lastName: config.lastName,
                hotels: [...allHotels.map(hotel => hotel._id)],
                favorites: []
            };
            yield usersCollection.insertOne(Object.assign({}, user));
            console.log('default user created in db');
        }
    });
}
module.exports = {
    seedsToDb,
    createAdmin,
};
//# sourceMappingURL=utils.js.map