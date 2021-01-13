const express = require('express');
const router = express.Router();

const bouncer = require('express-bouncer')(500,600000,3);

const {userValidationRules, validate} = require('../middleware/inputValidator');
const userController = require('../controllers/user');

router.post('/signup', userValidationRules(), validate, userController.signup);

router.post('/login', bouncer.block, userController.login);

module.exports = router;