const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearProyecto = async (req, res) =>{

    //errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errors: errores.array()})
    }

    try{
        //crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        proyecto.save();
        res.json(proyecto);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los proyectos del ususario actual
exports.obtenerProyecto = async(req,res) =>{
    try{
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1});
        res.json({proyectos});
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}