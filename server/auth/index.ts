import * as error from'http-errors';
const bcrypt = require('bcrypt');

const db = require('./../../db');
const { DATES } = require('./../common/constants');

async function userCreate(email, password, login = '', firstName = '', lastName = '') {
    const usersCollection = db.get().collection('users');
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

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

    const insert = await usersCollection.insertOne({ ...user });

    if (insert.result && insert.result.ok === 1 && insert.result.n === 1) {
        const insertedUser = insert.ops[0];
        insertedUser.id = insertedUser._id;
        delete insertedUser._id;

        return { ...insertedUser };
    } else {
        throw error(400, 'User not created');
    }

}

module.exports = {
    userCreate,
};
