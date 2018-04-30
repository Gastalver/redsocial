'use strict';
// Para crear los modelos hay que usar el módulo mongoose.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FollowSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User'},
    followed: { type: Schema.ObjectId, ref: 'User'},
});
// Sintaxis -exigida por mongoose- para exportar el modelo creado con el esquema y que esté disponible.
module.exports = mongoose.model('Follow',FollowSchema);