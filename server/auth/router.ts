import * as express from 'express';
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const config = require('./../../config');
const handlers = require('./handlers');
import { IUserRequest } from './models';

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req: IUserRequest, res) => {
    const token = jwt.sign(req.user, config.jwtsecret, { expiresIn: '24h' });
    return res.json({ user: req.user, token });
});

router.get('/logout', passport.authenticate('jwt', { session: false }), (req: IUserRequest, res) => {
    req.logout();
    res.send('You are logout');
});

router.get('/check_token', passport.authenticate('jwt', { session: false }), (req: IUserRequest, res) => {
    res.send({ autorized: true });
});

router.post('/sign_up', handlers.signUpHandler);

module.exports = router;
