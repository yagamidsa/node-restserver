require('./config/config');




const mongoose = require('mongoose');



const express = require('express');
const app = express();

const bodyParser = require('body-parser');





// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//importar rutas de usuario
app.use(require('./routes/usuario'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw err;
        console.log('Base de datos ONLINE')

    });


app.listen(process.env.PORT, () => {
    console.log('escuchando Puerto:', process.env.PORT);
});