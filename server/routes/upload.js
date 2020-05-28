const express = require('express');
const fileUpload = require('express-fileupload');
const { json } = require('body-parser');
const app = express();

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se a seleccionado ningun archivo'
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

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`Uploads/${archivo.name}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            message: 'Archivo cargado correctamente'

        });
    });
});


module.exports = app;