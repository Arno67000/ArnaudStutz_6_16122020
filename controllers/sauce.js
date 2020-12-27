const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.addNewSauce = (req, res, next) => {
    const newSauce = JSON.parse(req.body.sauce);
    const newImage = req.file.filename;
    console.log(newImage);
    console.log(req.body);
    
    const sauce = new Sauce({
        ... newSauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${newImage}`,
        likes: 0,
        dislikes: 0,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Nouvelle sauce ajoutée.'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    if (req.file) {
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                const img = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${img}`, (err => {
                    if (err) console.log(err); 
                    else { 
                        console.log(`Deleted file: ${img}`);
                    }
                }));
            })
            .catch(error => res.status(404).json({ error }));
    };
    const sauce = req.file?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    
    Sauce.updateOne({_id: req.params.id}, {...sauce, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifiée.'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const img = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${img}`, (err => {
                if (err) console.log(err); 
                else { 
                    console.log(`Deleted file: ${img}`);
                }
            }));
            Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({ message: 'Sauce supprimée.'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    console.log(req.params.id);
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const likeArray = sauce.usersLiked;
            const dislikeArray = sauce.usersDisliked;
            const foundLike = likeArray.find(element => element === req.body.userId);
            const foundDislike = dislikeArray.find(element => element === req.body.userId);
            if (req.body.like === 1 && foundLike === undefined) {
                likeArray.push(req.body.userId);
                Sauce.updateOne({_id: req.params.id}, {usersLiked: likeArray, likes: likeArray.length})
                    .then(() => res.status(200).json({ message: 'Like ajouté!!'}))
                    .catch(error => res.status(500).json({ error }));
            }
            else if (req.body.like == -1 && foundDislike === undefined) {
                dislikeArray.push(req.body.userId);
                Sauce.updateOne({_id: req.params.id}, {usersDisliked: dislikeArray, dislikes: dislikeArray.length})
                    .then(() => res.status(200).json({ message: 'Dislike ajouté!!'}))
                    .catch(error => res.status(500).json({ error }));
            }
            else if (req.body.like === 0) {
                if (foundLike != 'undefined') {
                    const target = likeArray.indexOf(foundLike);
                    likeArray.splice(target, 1);
                    Sauce.updateOne({_id: req.params.id}, {usersLiked: likeArray, likes: likeArray.length})
                        .then(() => res.status(200).json({ message: 'Like retiré!!'}))
                        .catch(error => res.status(500).json({ error }));
                }
                if (foundDislike != 'undefined') {
                    const target = dislikeArray.indexOf(foundDislike);
                    dislikeArray.splice(target, 1);
                    Sauce.updateOne({_id: req.params.id}, {usersDisliked: dislikeArray, dislikes: dislikeArray.length})
                        .then(() => res.status(200).json({ message: 'Dislike retiré!!'}))
                        .catch(error => res.status(500).json({ error }));
                }
                else {
                    throw error;
                };
            }
            else {
                console.log(error);
            };
        })
        .catch(error => res.status(500).json({ error }));
};