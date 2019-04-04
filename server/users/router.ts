import * as express from 'express';

const handlers = require('./handlers');

const router = express.Router();

router.get(['/', '/:login'], handlers.getUsersHandler);
// router.post('/', passport.authenticate('jwt', { session: false }), handlers.createUserHandler);
// router.delete('/:uid', passport.authenticate('jwt', { session: false }), handlers.removeUserHandler);

module.exports = router;
