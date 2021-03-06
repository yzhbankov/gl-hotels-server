import * as express from 'express';
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const config = require('./../../config');
const handlers = require('./handlers');
const Users =  require('../users');
import { IUserRequest } from './models';

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req: IUserRequest, res, next) => {
    try {
        const token = jwt.sign(req.user, config.jwtsecret, {expiresIn: '24h'});
        return res.json({user: req.user, token});
    } catch (err) {
        next(err)
    }
});

router.get('/logout', passport.authenticate('jwt', { session: false }), (req: IUserRequest, res) => {
    req.logout();
    res.send('You are logout');
});

router.get('/check_token', passport.authenticate('jwt', { session: false }), async (req: IUserRequest, res, next) => {
    try {
        const token: string = req.headers.authorization;
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
        const user = await Users.getUsers(decoded.login, {});
        res.send({...user});
    } catch (err) {
        next(err);
    }
});

router.post('/sign_up', handlers.signUpHandler);

module.exports = router;
