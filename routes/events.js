/*
    Events routes
    /api/events
*/
const{ Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEvento, actualizarEvento, crearEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const router = Router();


// Todas tiene que pasar por la validacion del jwt - si no, no funciona
router.use(validarJWT);


// Obtener eventos
router.get(
    '/',
    [
        check('title', 'El titulo es requerido').not().isEmpty(),
        check('start', 'Fcha de inicio es requerido').custom( isDate ),
        check('end', 'Fcha de finalización es requerido').custom( isDate ),
        validarCampos
    ], 
    getEvento
)

// Crear un nuevo evento
router.post(
    '/', 
    [
        check('title', 'El titulo es requerido').not().isEmpty(),
        check('start', 'Fcha de inicio es requerido').custom( isDate ),
        check('end', 'Fcha de finalización es requerido').custom( isDate ),
        validarCampos
    ], 
    crearEvento)

// Acutalizar evento
router.put(
    '/:id', 
    [
        check('title', 'El titulo es requerido').not().isEmpty(),
        check('start', 'Fcha de inicio es requerido').custom( isDate ),
        check('end', 'Fcha de finalización es requerido').custom( isDate ),
        validarCampos
    ],
    actualizarEvento)

// Borrar evento
router.delete('/:id', eliminarEvento)

module.exports = router


