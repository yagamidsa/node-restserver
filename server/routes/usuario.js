const express = require('express');

const bcrypt = require('bcryptjs');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();



const { verificatoken, verificaadminrole } = require('../middlewares/autenticacion');
const usuario = require('../models/usuario');

app.get('/usuario', verificatoken, (req, res) => {

    let desde = req.query.desde || 0;

    //convertir string a numerico
    desde = Number(desde);

    let limite = req.query.limite || 5;

    //convertir string a numerico
    limite = Number(limite);




    Usuario.find({ estado: true }, 'nombre email role estado img google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });


        });
});



//ingresar registros
app.post('/usuario', [verificatoken, verificaadminrole], function(req, res) {


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
app.put('/usuario/:id', [verificatoken, verificaadminrole], function(req, res) {

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
app.delete('/usuario/:id', [verificatoken, verificaadminrole], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true, context: 'query' },
        (err, usuarioBorrado) => {
            // Cambiar estado a false ya que no se elimina registros si no se cambia el estado
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'usuario no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                usuario: usuarioBorrado
            });


        });

});



// Eliminar un registro de la base de datos
// let id = req.params.id;

// Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

//     if (err) {
//         return res.status(400).json({
//             ok: false,
//             err
//         });
//     };

//     if (!usuarioBorrado) {
//         return res.status(400).json({
//             ok: false,
//             err: {
//                 message: 'usuario no encontrado'
//             }
//         });
//     }
//     res.json({
//         ok: true,
//         usuario: usuarioBorrado
//     });


// });

//});


module.exports = app;