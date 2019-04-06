import * as express from 'express';
const passport = require('passport');

const handlers = require('./handlers');

const router = express.Router();

router.get(['/', '/:uid'], handlers.getHotelsHandler);
router.post('/', passport.authenticate('jwt', { session: false }), handlers.createHotelHandler);
router.delete('/:uid', passport.authenticate('jwt', { session: false }), handlers.removeHotelsHandler);

module.exports = router;
