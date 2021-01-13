const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errors: errores.array()})
    }

    const {email, password} = req.body;

    try{
        //revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        //crea el nuevo ususario
        usuario = new Usuario(req.body);

        //hasear el password	
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        //crear y firmar el JWT
        const payload = {
            usuario:{
                id : usuario.id
            }
        };

        //firmar token
        jwt.sign(payload,process.env.SECRETA, {
            expiresIn: 3600
        }, (error,token)=>{
            if(error) throw error;
            res.json({token});
        });

        

    }catch(error){
        console.log(error);
        res.status(400).send("Hubo un error");
    }
}