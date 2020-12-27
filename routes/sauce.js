const express = require('express');
const router = express.Router();

const sauceControl = require('../controllers/sauce');
const authentify = require('../middleware/authentify');
const multer = require('../middleware/multer');

router.post('/', authentify, multer, sauceControl.addNewSauce);

router.post('/:id/like', authentify, sauceControl.likeSauce);

router.put('/:id', authentify, multer, sauceControl.modifySauce);

router.get('/', authentify, sauceControl.getAllSauces);

router.get('/:id', authentify, sauceControl.getOneSauce);

router.delete('/:id', authentify, sauceControl.deleteSauce);

module.exports = router;