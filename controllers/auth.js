const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'el email ya existe'
            });
        }

        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email });
        
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'el usuario no existe'
            });
        }        

        // Confirmar los password
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if  ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'contraseña incorrecta'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }

}

const revalidarToken = async(req, res) => {

    const uid = req.uid;
    const name = req.name;

    // Generar un nuevo JWT y retonarlo en esta peticion
    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
        uid, name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}