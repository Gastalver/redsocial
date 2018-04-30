'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = require('../services/claveToken');

exports.ensureAuth = function (req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
    }
    var token = req.headers.authorization.replace(/['"]+/g,''); // Esto es para quitar las comillas del token antes de evaluarlo.
    try{
        var payload = jwt.decode(token,secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:'El token ha expirado'});
        }
    } catch(ex) {
        return res.status(401).send({message:'El token no es válido'});
    }

    // Una vez autenticado, cargamos los datos del usuario (con la estructura de payload cfr./services/jwt)
    // en req, pera que estén siempre disponibles.
    req.user = payload;

    //Culminado el middleware que de paso a lo siguiente.
    next();

};

//TODO se puede añadir y exportar también una función de autorización.