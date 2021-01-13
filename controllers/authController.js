const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async(req,res) => {

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errors: errores.array()})
    }

    //extraer email y password
    const {email, password} = req.body;
    try{
        //revisar que usuario existante
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        //revisar el pasword
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg: 'Password incorrecto'});
        }

        // si todo es correcto
        //crear y firmar el JWT
        const payload = {
            usuario:{
                id:usuario.id
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
    }
}