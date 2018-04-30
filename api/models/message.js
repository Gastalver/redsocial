'use strict';
// Para crear los modelos hay que usar el módulo mongoose.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MessageSchema = Schema({
    emitter: { type: Schema.ObjectId, ref: 'User'},
    receiver: { type: Schema.ObjectId, ref: 'User'},
    text: String,
    created_at: String,
});
// Sintaxis -exigida por mongoose- para exportar el modelo creado con el esquema y que esté disponible.
module.exports = mongoose.model('Message',MessageSchema);