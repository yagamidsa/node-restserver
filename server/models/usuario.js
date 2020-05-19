const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesvalidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};



let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String,
        required: false
    }, //no es obliagtorio
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesvalidos
    }, //default
    estado: {
        type: Boolean,
        default: true
    }, //boolean
    google: {
        type: Boolean,
        default: false
    } //boolean
});


usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}



usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });


module.exports = mongoose.model('Usuario', usuarioSchema);