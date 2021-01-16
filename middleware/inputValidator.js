const {check, validationResult} = require('express-validator');

const userValidationRules = () => {
    return [
        check('email').isEmail().withMessage({message: 'Not an email'}),
        check('password').isStrongPassword({ 
            minLength: 8,
            minLowercase: 1, 
            minUppercase: 1, 
            minNumbers: 1, 
            minSymbols: 1, 
            returnScore: false, 
            pointsPerUnique: 1, 
            pointsPerRepeat: 0.5, 
            pointsForContainingLower: 10, 
            pointsForContainingUpper: 10, 
            pointsForContainingNumber: 10, 
            pointsForContainingSymbol: 10 })
            .withMessage({message: 'Le mot de passe doit contenir 8 caractères dont: 1 Majuscule, 1 minuscule, 1 chiffre ET un symbole'})
        
    ];
};


const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next();
    }
    else {
        return res.status(400).json({ message: 'Le mot de passe doit contenir 8 caractères dont: 1 Majuscule, 1 minuscule, 1 chiffre ET un symbole' });
    };
};

module.exports = {userValidationRules, validate};