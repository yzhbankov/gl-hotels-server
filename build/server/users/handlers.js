var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Users = require('./');
function getUsersHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const login = req.params.login;
            const options = {
                limit: req.query.limit ? Number(req.query.limit) : 0,
                offset: req.query.offset ? Number(req.query.offset) : 0,
            };
            if (login) {
                const user = yield Users.getUsers(login, {});
                res.status(200).send(user);
            }
            else {
                const users = yield Users.getUsers(null, options);
                res.status(200).send(users);
            }
        }
        catch (err) {
            next(err);
        }
    });
}
function createUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {
                email: req.body.email,
                password: req.body.password,
                admin: req.body.admin,
            };
            const user = yield Users.createUser(data);
            res.status(200).send(user);
        }
        catch (err) {
            next(err);
        }
    });
}
function removeUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.params.uid;
            const user = yield Users.removeUser(uid);
            res.status(204).send(user);
        }
        catch (err) {
            next(err);
        }
    });
}
module.exports = {
    getUsersHandler,
    createUserHandler,
    removeUserHandler,
};
//# sourceMappingURL=handlers.js.map