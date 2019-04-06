module.exports = function makeValidateMiddleware(schema, validateTarget = (x) => x) {
    return function validateMiddleware(req, res, next) {
        schema.validate(validateTarget(req.body), {
            stripUnknown: true,
            abortEarly: false,
        }, (err, result) => {
            if (err) {
                // console.error('Validation Error  error ', err);
                return next(err);
            }
            req.data = result;
            return next();
        });
    };
};
