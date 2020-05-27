const express = require('express');
const _ = require('underscore');
const { verificatoken, verificaadminrole } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');
const producto = require('../models/producto');






//==========================
// obtener productos
//===========================

app.get('/productos', verificatoken, (req, res) => {
    //cargar usuario
    //populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;

    //convertir string a numerico
    desde = Number(desde);

    let limite = req.query.limite || 5;

    //convertir string a numerico
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre precioUni descripcion disponible')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });

            });


        });
});

//==========================
// obtener productos id
//===========================

app.get('/productos/:id', verificatoken, (req, res) => {
    //cargar usuario
    //populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es Valido'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        }).populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');
});


//==========================
// buscar productos
//===========================
app.get('/productos/buscar/:termino', verificatoken, (req, res) => {

    let termino = req.params.termino;

    //exprecion regular
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });

});







//==========================
// crear productos
//===========================

app.post('/productos', verificatoken, (req, res) => {
    //grabar producto
    //grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    //regresa el nuevo producto
    //req.usuario._id
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto ya existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB

        });


    });


});

//==========================
// actualizar productos
//===========================

app.put('/productos/:id', [verificatoken, verificaadminrole], (req, res) => {
    //grabar producto
    //grabar una categoria del listado
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "ID no existe"
                }
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
});


//==========================
// Eliminar productos
//===========================

app.delete('/productos/:id', [verificatoken, verificaadminrole], (req, res) => {
    //no borrar disponible a false
    let id = req.params.id;
    let cambiaDispo = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaDispo, { new: true, runValidators: true, context: 'query' },
        (err, productoBorrado) => {
            // Cambiar estado a false ya que no se elimina registros si no se cambia el estado
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'producto no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,

            });


        });

});


module.exports = app;