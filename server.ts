const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

import * as config from './config.json';

const app = express();

app.use(passport.initialize());
app.use(passport.session());


const api = require('./server/api');
const db = require('./db');

const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 },
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    const usersCollection = db.get().collection('users');
    usersCollection.findOne({ _id: id }, (err, user) => {
        done(err, user);
    });
});


app.use(api);

db.connect(config.db.url, (err) => {
    if (err) {
        console.error('Unable to connect to Mongo.', err);
        process.exit(1);
    } else {
        app.listen(config.server.port, () => {
            console.log(`GL hotels server listening on port ${config.server.port}`);
        });
    }
});
