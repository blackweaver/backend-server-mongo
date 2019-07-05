var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//=========================================================================
// Búsqueda por colección
//=========================================================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    if(tabla == 'hospital') {
        promesa = buscarHospitales(busqueda, regex);
    } else if(tabla == 'medico') {
        promesa = buscarMedicos(busqueda, regex);
    } else if(tabla == 'usuarios') {
        promesa = buscarUsuarios(busqueda, regex);
    } else {
        return res.status(500).json({
            ok: false,
            mensaje: "La tabla no existe"
        });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data,
        });
    });

});

//=========================================================================
// Búsqueda general
//=========================================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex) ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
            });

        });
    
});


function buscarHospitales( busqueda, regex ){

    return new Promise((resolve, reject) => {

        Hospital.find({nombre: regex})
            .populate('usuario','nombre email')
            .exec((err, hospitales) => {
                if(err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });

    });
}

function buscarMedicos( busqueda, regex ){

    return new Promise((resolve, reject) => {

        Medico.find({nombre: regex})
            .populate('usuario','nombre email')
            .exec((err, medicos) => {
                if(err) {
                    reject('Error al cargar médicos', err);
                } else {
                    resolve(medicos);
                }
            });

    });
}

function buscarUsuarios( busqueda, regex ){

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if(err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;