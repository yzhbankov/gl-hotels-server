import * as express from 'express';
const passport = require('passport');

const handlers = require('./handlers');

const router = express.Router();

router.get(['/', '/:login'], passport.authenticate('jwt', { session: false }), handlers.getUsersHandler);
router.post('/', passport.authenticate('jwt', { session: false }), handlers.createUserHandler);
router.delete('/:uid', passport.authenticate('jwt', { session: false }), handlers.removeUserHandler);

module.exports = router;
