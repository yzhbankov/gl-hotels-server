const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const Utils = require('./utils');

const state = {
    db: null,
    mode: null,
};

module.exports.connect = (url, done) => {
    if (state.db) return done();

    MongoClient.connect(url, async (err, client) => {
        if (err) return done(err);
        console.log(`set gl hotels server db connection in url: ${url}`);
        state.db = client.db(config.db.name);

        await Utils.seedsToDb(state.db);
        await Utils.createAdmin(state.db);
        done();
    });
};

module.exports.get = () => {
    return state.db;
};

module.exports.close = (done) => {
    if (state.db) {
        state.db.close((err) => {
            state.db = null;
            state.mode = null;
            done(err);
        });
    }
};
