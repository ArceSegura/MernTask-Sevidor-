const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authController = require('../controllers/authController');


router.post('/',
    [
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe contener 5 caracteres').isLength({min:6})
    ],
    authController.autenticarUsuario
);

module.exports = router;