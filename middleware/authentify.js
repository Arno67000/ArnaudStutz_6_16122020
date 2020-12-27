const jswebtkn = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verifiedToken = jswebtkn.verify(token, 'CRYPTAGEDUTOKEN2226080389');
        const userId = verifiedToken.userId;
        if(req.body.userId && req.body.userId !== userId) {
            return res.status(400).json({ message: 'Id utilisateur non valide.'})
        }
        else {
            next();
        };
    }
    catch {
        return res.status(400).json({ message: 'La requête nécessite authentification.'})
    };
};