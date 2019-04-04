async function getUsersHandler(req, res, next) {
    try {
        // const login = req.params.login;
        // const options = {
        //     limit: req.query.limit ? Number(req.query.limit) : 0,
        //     offset: req.query.offset ? Number(req.query.offset) : 0,
        // };
        // if (login) {
        //     const user = await Users.getUsers(login, {});
        //     res.status(200).send(user);
        // } else {
        //     const users = await Users.getUsers(null, options);
            res.status(200).send([]);
        // }
    } catch (err) {
        next(err);
    }
}


module.exports = {
    getUsersHandler,
};
