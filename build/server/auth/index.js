"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const error = require("http-errors");
const bcrypt = require('bcrypt');
const db = require('./../../db');
const { DATES } = require('./../common/constants');
function userCreate(email, password, login = '', firstName = '', lastName = '') {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const usersCollection = db.get().collection('users');
        const saltRounds = 10;
        const hash = yield bcrypt.hash(password, saltRounds);
        const user = {
            email,
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
            removedAt: new Date(DATES.REMOVED_AT),
            login,
            firstName,
            lastName,
            hotels: []
        };
        const insert = yield usersCollection.insertOne(Object.assign({}, user));
        if (insert.result && insert.result.ok === 1 && insert.result.n === 1) {
            const insertedUser = insert.ops[0];
            insertedUser.id = insertedUser._id;
            delete insertedUser._id;
            return Object.assign({}, insertedUser);
        }
        else {
            throw error(400, 'User not created');
        }
    });
}
module.exports = {
    userCreate,
};
//# sourceMappingURL=index.js.map