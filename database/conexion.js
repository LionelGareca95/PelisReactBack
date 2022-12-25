const mongoose = require("mongoose");

const conexion = async() => {
    
    try {
        await mongoose.connect("mongodb://localhost:27017/mi_blog")

        console.log("Conectado correctamente a la base de datos de mi_blog")
    } catch (error) {
        console.log(error)
        throw new Error("no se ha podido conectar a la base de datos")
    }
}

module.exports = {
    conexion
}