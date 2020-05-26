require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());




//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));



//importar rutas de usuario (configuracion global de rutas)
app.use(require('./routes/index'));


// hacer un require de path que es de nodejs no se instala y unor con comas las rutas
//console.log(path.resolve(__dirname, '../public'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw err;
        console.log('Base de datos ONLINE')

    });


app.listen(process.env.PORT, () => {
    console.log('escuchando Puerto:', process.env.PORT);
});