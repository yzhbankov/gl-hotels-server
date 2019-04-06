"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const error = require('http-errors');
const db = require('./../../db');
const Auth = require('./');
function signUpHandler(req, res, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, login, firstName, lastName } = req.body;
            if (!password || !email || !login) {
                throw error(422, 'Should be specified password, email and login');
            }
            const usersCollection = db.get().collection('users');
            const usersExist = yield usersCollection.find({ $or: [{ email }, { login }] }).toArray();
            if (usersExist.length > 0) {
                throw error(422, 'User with this email or login already exist');
            }
            const newUser = yield Auth.userCreate(email, password, login, firstName, lastName);
            res.send(newUser);
        }
        catch (err) {
            console.error(err);
            next(err);
        }
    });
}
module.exports = {
    signUpHandler,
};
//# sourceMappingURL=handlers.js.map