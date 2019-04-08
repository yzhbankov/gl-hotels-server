"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const passport = require('passport');
const middlewares = require('../common/middlewarres');
const { favorites } = require('../common/validation_schemas');
const handlers = require('./handlers');
const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));
router.get(['/', '/:login'], handlers.getUsersHandler);
router.post('/', handlers.createUserHandler);
router.post('/favorites', middlewares.validate(favorites.addFavorite), handlers.favoriteToUserHandler);
router.delete('/favorites/:uid', handlers.removeFavoriteFromUserHandler);
router.delete('/:uid', handlers.removeUserHandler);
module.exports = router;
//# sourceMappingURL=router.js.map