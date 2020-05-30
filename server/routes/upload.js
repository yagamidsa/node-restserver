const express = require('express');
const fileUpload = require('express-fileupload');
const { json } = require('body-parser');
let app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


//importar file system para saber si el file existe

const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se a seleccionado ningun archivo'
                }
            });
    }


    //validar tipo

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'los tipos permitidos son ' + tiposValidos.join(', ')
                }
            });
    }
    // archivo es el nombre que se va colocar en el imput (en el postman se tiene que poner archivo tal cual como le coloamos)
    let archivo = req.files.archivo;


    // extensiones permitidas
    let nombreArchivo = archivo.name.split('.');
    //ultima posision de un arreglo ==> let extension = nombreArchivo[nombreArchivo -1];
    let extension = nombreArchivo[1];

    let extensionesValidas = [' png', 'jpg', 'gif', 'jpeg', 'txt', 'xlsx'];


    //buscar en un arreglo indexOF(lo buscado)< 0 si es menor que cero no esta lo buscado en el arreglo
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son' + extensionesValidas.join(', '),
                ext: extension
            }

        })
    }

    //cambiar nombre al archivo guardado
    let nombreArchivos = `${id}-${new Date().getMilliseconds()}.${extension}`;


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`Uploads/${tipo}/${nombreArchivos}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        // aqui, imagen se cargo

        if (`${tipo}` === 'usuarios') {
            imagenUsuario(id, res, nombreArchivos);
        } else {
            imagenProducto(id, res, nombreArchivos);
        }



    });
});




//funciones imagenes usuario


function imagenUsuario(id, res, nombreArchivos) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivos, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivos, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borraArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArchivos;

        usuarioDB.save((err, usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivos
            });
        });

    });
}


/// funcion cargar imagenes producto

function imagenProducto(id, res, nombreArchivos) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivos, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraArchivo(nombreArchivos, 'productos');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        // let pathImagen = path.resolve(__dirname, `../../uploads/productos/${productoDB.img}`);
        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borraArchivo(productoDB.img, 'productos');


        productoDB.img = nombreArchivos;

        productoDB.save((err, productoDB) => {
            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivos
            });
        });

    });
}



function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;