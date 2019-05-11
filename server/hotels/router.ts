import * as express from 'express';
const passport = require('passport');
const middlewares = require('../common/middlewarres');
const { hotels } = require('../common/validation_schemas');

const handlers = require('./handlers');

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

//query /hotels?offset=0&size=10
router.get(['/', '/:uid'], handlers.getHotelsHandler);
router.post('/', middlewares.validate(hotels.createHotel), handlers.createHotelHandler);

// vote to follow the hotel
router.put('/follow',  middlewares.validate(hotels.followHotel), handlers.followHotelHandler);

router.put('/:uid', middlewares.validate(hotels.updateHotel), handlers.updateHotelHandler);
router.delete('/:uid', handlers.removeHotelsHandler);

module.exports = router;
