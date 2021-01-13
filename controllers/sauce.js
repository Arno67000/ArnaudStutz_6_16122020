const Sauce = require('../models/Sauce');
const fs = require('fs');
const escape = require('escape-html');

exports.addNewSauce = (req, res, next) => {
    const newSauce = JSON.parse(req.body.sauce);
    const newImage = req.file.filename;
    console.log(newImage);
    
    const sauce = new Sauce({
        ...newSauce,
        name: escape(newSauce.name).replace(/^[\$\.]*/,''),
        manufacturer: escape(newSauce.manufacturer).replace(/^[\$\.]*/,''),
        description: escape(newSauce.description).replace(/^[\$\.]*/,''),
        mainPepper: escape(newSauce.mainPepper).replace(/^[\$\.]*/,''),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${newImage}`,
        likes: 0,
        dislikes: 0,
    });
    console.log(sauce);
    sauce.save()
        .then(() => res.status(201).json({ message: 'Nouvelle sauce ajoutée.'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    //SI nouvelle image, suppression de l'ancienne image de la database.
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
    //Modification de l'objet Sauce en fonction des données changées.
    const sauce = req.file?
        {
            ...JSON.parse(req.body.sauce),
            name: escape(JSON.parse(req.body.sauce).name).replace(/^[\$\.]*/,''),
            manufacturer: escape(JSON.parse(req.body.sauce).manufacturer).replace(/^[\$\.]*/,''),
            description: escape(JSON.parse(req.body.sauce).description).replace(/^[\$\.]*/,''),
            mainPepper: escape(JSON.parse(req.body.sauce).mainPepper).replace(/^[\$\.]*/,''),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body,
            name: escape(req.body.name).replace(/^[\$\.]*/,''),
            manufacturer: escape(req.body.manufacturer).replace(/^[\$\.]*/,''),
            description: escape(req.body.description).replace(/^[\$\.]*/,''),
            mainPepper: escape(req.body.mainPepper).replace(/^[\$\.]*/,''),
        };
    console.log(sauce);

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
    switch (req.body.like) {

        case 1 :
            Sauce.updateOne({_id : req.params.id},{$inc : {likes: 1},  $addToSet : {usersLiked: req.body.userId}})
                .then(() => res.status(200).json({ message: 'Like ajouté!!'}))
                .catch(error => res.status(400).json({ error }));
            break;

        case -1 :
            Sauce.updateOne({_id : req.params.id},{$inc : {dislikes: 1},  $addToSet : {usersDisliked: req.body.userId}})
                .then(() => res.status(200).json({ message: 'Dislike ajouté!!'}))
                .catch(error => res.status(400).json({ error }));
            break;

        case 0 : 
            Sauce.findOne({$or: [{_id: req.params.id, usersLiked: req.body.userId}, {_id: req.params.id, usersDisliked: req.body.userId}]})
                .then(sauce => {
                    if (sauce.usersLiked.find(element => element === req.body.userId)) {
                        Sauce.updateOne({_id: req.params.id}, {$inc : {likes: -1}, $pull : {usersLiked: req.body.userId}})
                            .then(() => res.status(200).json({ message: 'Like retiré!!'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                    else if (sauce.usersDisliked.find(element => element === req.body.userId)) {
                        Sauce.updateOne({_id : req.params.id},{$inc : {dislikes: -1},  $pull : {usersDisliked: req.body.userId}})
                            .then(() => res.status(200).json({ message: 'Dislike ajouté!!'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                    else {
                        throw err; 
                    }
                })
                .catch(error => res.status(400).json({ error }));
            break;

        default : 
               return res.status(500).json({ message: 'Error post'})
    };
};