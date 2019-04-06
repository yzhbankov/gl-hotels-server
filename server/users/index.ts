import * as error from 'http-errors';
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;

const db = require('./../../db');
const { DATES } = require('./../common/constants');

async function findUserByEmailOrUid(email, uid) {
    const usersCollection = db.get().collection('users');
    let user;
    if (email) {
        user = await usersCollection.findOne({ email });
    } else if (uid) {
        user = await usersCollection.findOne({ _id: ObjectId(uid) });
    }
    return user;
}

async function setHotelsToUser(email, hotels) {
    try {
        const usersCollection = db.get().collection('users');
        let user;
        if (email) {
            user = await usersCollection.updateOne(
                { email },
                { $set: { hotels } },
            );
        }
        return user;
    } catch (err) {
        throw err;
    }
}

function formatUser(user) {
    return {
        login: user.login,
        avatarUrl: user.avatarUrl ? user.avatarUrl : '',
        hotels: user.hotels ? user.hotels : [],
    };
}

async function getUsers(login = null, { offset = 0, limit = 0 }) {
    const usersCollection = db.get().collection('users');
    if (!login) {
        const users = await usersCollection.find({
            $where: `(new Date(this.removedAt)).getTime() === ${(new Date(DATES.REMOVED_AT)).getTime()}`,
        })
            .skip(offset).limit(limit).toArray();

        return users.map(user => formatUser(user));
    }

    const user = await usersCollection.findOne({
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
}

async function createUser(user) {
    const usersCollection = db.get().collection('users');
    const userExist = await findUserByEmailOrUid(user.email, null);
    if (userExist) {
        throw error(422, 'User with this email already exist');
    }
    const now = (new Date()).getTime();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const result = await usersCollection.insert({
        email: user.email, password: hashedPassword, admin: user.admin, created_at: now,
    });

    return result.ops[0];
}

async function removeUser(uid) {
    const usersCollection = db.get().collection('users');
    const userExist = await findUserByEmailOrUid(null, uid);
    if (!userExist) {
        throw error(404, 'Removed user not found');
    }
    await usersCollection.deleteOne({
        _id: uid,
    });

    return userExist;
}

module.exports = {
    getUsers,
    createUser,
    removeUser,
    findUserByEmailOrUid,
    setHotelsToUser,
};
