var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const Utils = require('./utils');
const state = {
    db: null,
    mode: null,
};
module.exports.connect = (url, done) => {
    if (state.db)
        return done();
    MongoClient.connect(url, (err, client) => __awaiter(this, void 0, void 0, function* () {
        if (err)
            return done(err);
        console.log(`set gl hotels server db connection in url: ${url}`);
        state.db = client.db(config.db.name);
        console.log('state.db ', state.db);
        yield Utils.seedsToDb(state.db);
        yield Utils.createAdmin(state.db);
        done();
    }));
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
//# sourceMappingURL=index.js.map