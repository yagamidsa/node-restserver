const express = require('express');
const fs = require('fs');

const path = require('path');
let app = express();


app.get('/imagen/:tipo/:img', (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `./Uploads/${tipo}/${img}`;

    let noImagenPath = path.resolve(__dirname, '../assets/foto.jpg');

    res.sendFile(noImagenPath);


})


module.exports = app;