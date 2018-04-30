'use strict'
// Para crear los modelos hay que usar el módulo mongoose.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});
// Sintaxis -exigida por mongoose- para exportar el modelo creado con el esquema y que esté disponible.
module.exports = mongoose.model('User',UserSchema);


