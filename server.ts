const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

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

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (username, password, done) => {
        const usersCollection = db.get().collection('users');
        const user = await usersCollection.findOne({ email: username }, { password: false });

        if (!user) { return done(null, false); }

        const correctPassword = bcrypt.compareSync(password, user.password);

        if (!correctPassword) { return done(null, false); }

        delete user.password;

        return done(null, user);
    },
));

passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtsecret,
    },
    async (jwtPayload, done) => {
        const usersCollection = db.get().collection('users');
        const user = await usersCollection.findOne({ email: jwtPayload.email });

        if (!user) { return done(null, false); }

        return done(null, user);
    },
));

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
        app.listen(process.env.PORT || config.server.port, () => {
            console.log(`GL hotels server listening on port ${process.env.PORT || config.server.port}`);
        });
    }
});
