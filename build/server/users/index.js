"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const error = require("http-errors");
const bcrypt = require('bcrypt');
const _Uniq = require('lodash.uniq');
const ObjectId = require('mongodb').ObjectID;
const db = require('./../../db');
const { IUser } = require('../common/models');
const { DATES } = require('./../common/constants');
function findUserByEmailOrUid(email, uid) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const usersCollection = db.get().collection('users');
        let user;
        if (email) {
            user = yield usersCollection.findOne({ email });
        }
        else if (uid) {
            user = yield usersCollection.findOne({ _id: ObjectId(uid) });
        }
        return user;
    });
}
function setHotelsToUser(email, hotels) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const usersCollection = db.get().collection('users');
            let user;
            if (email) {
                user = yield usersCollection.updateOne({ email }, { $set: { hotels } });
            }
            return user;
        }
        catch (err) {
            throw err;
        }
    });
}
function addFavorite(user, hotelId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const usersCollection = db.get().collection('users');
            const favorites = _Uniq([...user.favorites, hotelId]);
            const result = yield usersCollection.findOneAndUpdate({ email: user.email }, { $set: { favorites } }, { returnOriginal: false });
            return formatUser(result.value);
        }
        catch (err) {
            throw err;
        }
    });
}
function removeFavorite(user, hotelId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const usersCollection = db.get().collection('users');
            const favorites = user.favorites.filter(_hotelId => _hotelId !== hotelId);
            const result = yield usersCollection.findOneAndUpdate({ email: user.email }, { $set: { favorites } }, { returnOriginal: false });
            return formatUser(result.value);
        }
        catch (err) {
            throw err;
        }
    });
}
function formatUser(user) {
    return {
        login: user.login,
        avatarUrl: user.avatarUrl ? user.avatarUrl : '',
        hotels: user.hotels ? user.hotels : [],
        favorites: user.favorites ? user.favorites : []
    };
}
function getUsers(login = null, { offset = 0, limit = 0 }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const usersCollection = db.get().collection('users');
        if (!login) {
            const users = yield usersCollection.find({
                $where: `(new Date(this.removedAt)).getTime() === ${(new Date(DATES.REMOVED_AT)).getTime()}`,
            })
                .skip(offset).limit(limit).toArray();
            return users.map(user => formatUser(user));
        }
        const user = yield usersCollection.findOne({
            $and: [
                { login },
                {
                    $where: `(new Date(this.removedAt)).getTime() === ${(new Date(DATES.REMOVED_AT)).getTime()}`,
                },
            ],
        });
        if (!user) {
            throw error(404, 'User not found');
        }
        return formatUser(user);
    });
}
function createUser(user) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const usersCollection = db.get().collection('users');
        const userExist = yield findUserByEmailOrUid(user.email, null);
        if (userExist) {
            throw error(422, 'User with this email already exist');
        }
        const now = (new Date()).getTime();
        const saltRounds = 10;
        const hashedPassword = yield bcrypt.hash(user.password, saltRounds);
        const result = yield usersCollection.insert({
            email: user.email, password: hashedPassword, admin: user.admin, created_at: now,
        });
        return result.ops[0];
    });
}
function removeUser(uid) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const usersCollection = db.get().collection('users');
        const userExist = yield findUserByEmailOrUid(null, uid);
        if (!userExist) {
            throw error(404, 'Removed user not found');
        }
        yield usersCollection.deleteOne({
            _id: uid,
        });
        return userExist;
    });
}
module.exports = {
    getUsers,
    createUser,
    removeUser,
    findUserByEmailOrUid,
    setHotelsToUser,
    addFavorite,
    removeFavorite,
};
//# sourceMappingURL=index.js.map