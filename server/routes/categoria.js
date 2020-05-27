const express = require('express');
const _ = require('underscore');
const { verificatoken, verificaadminrole } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');

//===============================
//mostrar todas las categorias
//===============================
app.get('/categoria', verificatoken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        //populate trae la informacion del token especifica que nosostros le indiquemos
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cant: conteo
                });
            });
        });
});

//====================================
//mostrar todas las categorias po id
//=====================================

app.get('/categoria/:id', verificatoken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es Valido'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//====================================
//Crear una nueva categoria
//=====================================


app.post('/categoria', [verificatoken, verificaadminrole], (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id

    });
    //regresa la nueva categoria
    //req.usuario._id
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria ya existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB

        });


    });


});
//====================================
//Actualizar la categoria
//=====================================
app.put('/categoria/:id', [verificatoken, verificaadminrole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//====================================
//borrar categoria
//=====================================

app.delete('/categoria/:id', [verificatoken, verificaadminrole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrado,
            message: 'categoria eliminada'
        });


    });

});








module.exports = app;