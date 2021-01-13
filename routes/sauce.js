const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce');
const authentify = require('../middleware/authentify');
const multer = require('../middleware/multer');

router.post('/', authentify, multer, sauceController.addNewSauce);

router.post('/:id/like', authentify, sauceController.likeSauce);

router.put('/:id', authentify, multer, sauceController.modifySauce);

router.get('/', authentify, sauceController.getAllSauces);

router.get('/:id', authentify, sauceController.getOneSauce);

router.delete('/:id', authentify, sauceController.deleteSauce);

module.exports = router;