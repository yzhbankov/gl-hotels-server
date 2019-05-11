"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('./../../config');
const handlers = require('./handlers');
const Users = require('../users');
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    const token = jwt.sign(req.user, config.jwtsecret, { expiresIn: '24h' });
    return res.json({ user: req.user, token });
});
router.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    req.logout();
    res.send('You are logout');
});
router.get('/check_token', passport.authenticate('jwt', { session: false }), (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
    const user = yield Users.getUsers(decoded.login, {});
    res.send(Object.assign({}, user));
}));
router.post('/sign_up', handlers.signUpHandler);
module.exports = router;
//# sourceMappingURL=router.js.map