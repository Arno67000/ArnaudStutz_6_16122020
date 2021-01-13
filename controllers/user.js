const jwebtkn = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bouncer = require('express-bouncer')(500,600000,3);


const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 15)
        .then(hash => {
            const mail = new Buffer.from(req.body.email, 'base64');
            console.log(mail.toString())
            const user = new User({
                email: mail.toString(),
                password: hash
            })
            console.log(user)
            user.save()
                .then(() => res.status(200).json({ message: 'Nouvel utilisateur enregistré.'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    try {
        const mail = new Buffer.from(req.body.email, 'base64');
        User.findOne({email: mail.toString()})
            .then(user => {
                if(user) {
                    bcrypt.compare(req.body.password, user.password)
                        .then(valid => {
                            if(valid) {
                                bouncer.reset (req);
                                return res.status(200).json({
                                    userId: user._id,
                                    token: jwebtkn.sign(
                                        {userId: user._id},
                                        'CRYPTAGEDUTOKEN2226080389',
                                        { expiresIn: '12h'}
                                    )
                                });
                            }
                            else {
                                return res.status(401).json({ message: 'Mot de passe invalide.'});
                            };
                        })
                        .catch(error => res.status(500).json({ error }));
                }
                else {
                    return res.status(401).json({ message: 'Attention utilisateur non-enregistré.'});
                };
            })
            .catch(error => res.status(500).json({ error }));
    }
    catch (e) {
        return res.status(500).json({ error });
    };
};