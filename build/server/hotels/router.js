"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const passport = require('passport');
const middlewares = require('../common/middlewarres');
const { hotels } = require('../common/validation_schemas');
const handlers = require('./handlers');
const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));
router.get(['/', '/:uid'], handlers.getHotelsHandler);
router.post('/', middlewares.validate(hotels.createHotel), handlers.createHotelHandler);
router.put('/:uid', middlewares.validate(hotels.updateHotel), handlers.updateHotelHandler);
router.delete('/:uid', handlers.removeHotelsHandler);
module.exports = router;
//# sourceMappingURL=router.js.map