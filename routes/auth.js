/*
    Rutas de usuario / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt')

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');


router.post(
    '/new', 
    [ // middlewares
        check('name', 'Nombre obligatorio').not().isEmpty(),
        check('email', 'email obligatorio').isEmail(),
        check('password', 'password debe ser 6 caracteres').isLength({min: 6}),
        validarCampos
    ] ,
    crearUsuario);

router.post(
    '/', 
    [ // middlewares
    check('email', 'email es obligatorio').isEmail(),
    check('password', 'password debe ser menos 6 caracteres').isLength({min: 6}),
    validarCampos
    ],
    loginUsuario,
);

router.get('/renew', validarJWT ,revalidarToken);


module.exports = router;