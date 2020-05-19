const express = require('express');

const bcrypt = require('bcryptjs');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();





app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;

    //convertir string a numerico
    desde = Number(desde);

    let limite = req.query.limite || 5;

    //convertir string a numerico
    limite = Number(limite);




    Usuario.find({}, 'nombre email role estado img google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });


        });
});



//ingresar registros
app.post('/usuario', function(req, res) {


    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB

        });


    });


});


//actualizar
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({

            ok: true,
            usuario: usuarioDB

        });
    })
});

//eliminar registos
app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
});


module.exports = app;