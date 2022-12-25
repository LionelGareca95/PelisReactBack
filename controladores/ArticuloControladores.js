const { validarArticulo } = require("../helpers/validar")
const Articulo = require ("../modelos/ArticuloModelos");
const fs = require("fs");
const path = require("path");


const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "soy una accion de pruebas en mi controlador de articulos"
    })
}

const curso = (req, res) => {

    console.log("Se ha ejecutado el endpoint probando")

    return res.status(200).send([{
        curso: "Master En React",
        autor: "Victor RObles Web",
        url: "url:www.victorroblesweb.es/master-react"
    }, 
    {
        curso: "Master En React",
        autor: "Victor RObles Web",
        url: "url:www.victorroblesweb.es/master-react"
    }, 
    ])
}

const crear = (req, res) => {

    // Recoger los parametros por post a guardar
    let parametros = req.body;

    try {
        validarArticulo(parametros) 
        } catch (error) {
            return res.status(400).json( {
                status: "error",
                parametros: "faltan datos por enviar"
            })
        }

    // Crear el objeto a guardar
    const articulo  = new Articulo(parametros);

    // Asignar valores a objetos basado en el modelo (Manual o automatico)
    // articulo.titulo = parametros.titulo;

    // Guardar el articulo en la Base de datos
    articulo.save((error, articuloGuardado) => {
        
        if(error || !articuloGuardado){
            return res.status(400).json( {
                status: "error",
                parametros: "No se ha guardado el articulo"
            })
        }
        // Devolver resultado
        return res.status(200).json( {
            status: "sucess",
            articulo: articuloGuardado,
            mensaje: "articulo creado exitosamente"
        })

    });

 
}

const listar = (req, res) => {
    
    let consulta = Articulo.find({})
                           .sort({fecha: -1})
                           .exec((error, articulos) => {

        if(error || !articulos) {
            return res.status(400).json( {
                status: "error",
                parametros: "No se ha encontrado articulos!"
            })
        }
        return res.status(200).send({
            status: "sucess",
            articulos
        })
    })

} 

const uno = (req, res) => {
    // Recoger id por la url
    let id = req.params.id;
    // Buscar el articulo
    Articulo.findById(id, (error, articulo) => {
        // Si no existe devuelve error
        if(error || !articulo) {
            return res.status(400).json( {
                status: "error",
                parametros: "No se ha encontrado el articulo!"
            });
        }
        
        // Devolver Resultado
        return res.status(200).json( {
            status: "sucess",
            articulo
        })
    })

}

const borrar = (req, res) => {

    let articuloId = req.params.id;

    Articulo.findOneAndDelete({_id: articuloId}, (error, articuloBorrado) => {

        if(error || !articuloBorrado) {
            return res.status(500).json( {
                status: "error",
                mensaje: "error al borrar"
            });
        }
        return res.status(200).json( {
            status: "sucess",
            articulo: articuloBorrado,
            mensaje: "metodo de borrar"
        })
    })
}




const editar = (req, res) => {
    // Recoger id articulo a editar
    let articuloId = req.params.id

    // Recoger datos del body
    let parametros = req.body;
    // Validar Datos
    try {
    validarArticulo(parametros) 
    } catch (error) {
        return res.status(400).json( {
            status: "error",
            parametros: "faltan datos por enviar"
        })
    }
 
    // Buscar y actualizar articulo
    Articulo.findOneAndUpdate({_id: articuloId}, parametros, {new: true}, (error, articulosActualizados) =>  {

        if(error || !articulosActualizados) {
            return res.status(200).json( {
                status: "error", 
                mensaje: "Error al actualizar"
            });
        }
    // Devolver repuesta
        return res.status(200).json( {
            status: "sucess",
            articulosActualizados
        })
    })

} 

const subir = (req, res) => {

    // Configurar multer

    // Recoger el fichero de imagen subido
    if(!req.file && !req.files) {
        return res.status(400).json( {
            status: "error",
            mensaje: "Peticion Invalida"
        })
    }
    // Nombre del archivo
    let archivo = req.file.originalname
    

    // Extension del archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1]
    
    // Comprobar extension correcta
    if(extension != "png" && extension !="jpg" && extension !="jpeg" && extension !="gif") {
        // Borrar archivo y dar repuesta

        fs.unlink(req.file.path, (error) => {
            return res.status(400).json( {
                status: "error",
                mensaje: "Imagen Invalida"
            })
        })
    } else {
       
        let articuloId = req.params.id


    // Buscar y actualizar articulo
    Articulo.findOneAndUpdate({_id: articuloId}, {imagen: req.file.filename}, {new: true}, (error, articulosActualizados) =>  {

        if(error || !articulosActualizados) {
            return res.status(400).json( {
                status: "error", 
                mensaje: "Error al actualizar"
            });
        }
        // Devolver repuesta
        return res.status(200).json( {
            status: "sucess",
            articulosActualizados,
            fichero: req.file
        })
     })
    }
}

const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenenes/articulos"+fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if(existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json( {
                status: "error", 
                mensaje: "La imagen no existe"
            });
        }
    })
}

const buscar = (req, res) => {

    // Sacar el string de busqueda
    let busqueda = req.params.busqueda;
    
    // Fund OR
    Articulo.find({ "$or": [
        {"titulo": {"$regex": busqueda, "$options": "i"}},
        {"contenido": {"$regex": busqueda, "$options": "i"}},
    ]})
    .sort({fecha: -1})
    .exec((error, articulosEncontrados) => {

        if(error || !articulosEncontrados || articulosEncontrados.length <= 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos"
            })
        }

        return res.status(200).json( {
            status: "sucess",
            articulos: articulosEncontrados
        })
    });
   
}
module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscar
}