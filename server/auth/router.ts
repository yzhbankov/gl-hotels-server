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

router.get('/logout', (req: IUserRequest, res) => {
    req.logout();
    res.send('You are logout');
});

router.post('/sign_up', handlers.signUpHandler);

module.exports = router;
