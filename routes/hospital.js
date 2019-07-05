//============================
// Rutas de los hospitales
// Códigos de respuesta: https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP
//============================

var express = require('express');
var mdAutenticacion = require('../middlewares/autenticate');
var app = express();
var Hospital = require('../models/hospital');

//============================
// Actualizar hospitales
//============================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id' + id +  "no existe",
                errors: { message: "No existe un hospital con ese ID"}
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});

//============================
// Obtener todos los hospitales
//============================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });

                });
        });
});

//============================
//Crear datos de hospitales
//============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado ) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });

});

//=========================================================================
// Borrar un hospital por el ID
//=========================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al borrar hospital',
                    errors: err
                });
            }

            if(!hospitalBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un hospital con ese ID',
                    errors: { message: 'No existe un hospital con ese ID'}
                });
            }
    
            res.status(200).json({
                ok: true,
                hospital: hospitalBorrado
            });
    
    });
});


module.exports = app;