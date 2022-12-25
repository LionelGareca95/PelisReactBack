const { conexion } = require("./database/conexion");
const express = require("express");
const cors = require("cors");

// Inicializar app
console.log("app de node arrancada");

// Conectar a la base de datos
conexion();

// Crear servidor node
const app = express();
const puerto = 3900;

// Configurar el cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // Recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})) // recibiendo datos form-urlencoded

// Crear rutas
const rutas_articulo = require("./rutas/ArticuloRutas");

// Cargo las rutas
app.use("/api", rutas_articulo)


// Rutas harcodeadas
app.get("/probando", (req, res) => {

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
})

app.get("/", (req, res) => {

    console.log("Se ha ejecutado el endpoint probando")

    return res.status(200).send(`
        <h1> probando ruta <h1>
    `)
})

// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("servidor corriendo en el puerto"+puerto);
});

