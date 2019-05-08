// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicialización de variables
var app = express();

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
    if( err ) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
});

//Rutas
app.get('/', (req, res, next) => {
    // Códigos de respuesta: https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});