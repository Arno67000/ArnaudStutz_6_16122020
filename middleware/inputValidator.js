const {check, validationResult} = require('express-validator');

const userValidationRules = () => {
    return [
        check('email').isEmail(),
        check('password').isLength({ min: 8 }),
    ];
};


const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next();
    }
    else {
        const errorsFound = [];
        errors.array().map(err => errorsFound.push({ [err.param]: err.msg }));

        return res.status(400).json({ errors: errorsFound });
    };
};

module.exports = {userValidationRules, validate};