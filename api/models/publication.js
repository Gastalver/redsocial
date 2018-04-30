'use strict';
// Para crear los modelos hay que usar el módulo mongoose.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PublicationSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User'},
    text: String,
    file: String,
    created_at: String,
});
// Sintaxis -exigida por mongoose- para exportar el modelo creado con el esquema y que esté disponible.
module.exports = mongoose.model('Publication',PublicationSchema);