'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

/**
 * Mera prueba
 * @param req
 * @param res
 */
function prueba(req,res){
    res.status(200).send({message: 'Hola mundo desde el controlador follows'});
}

/**
 * Guarda un seguimiento
 * @param req
 * @param res
 */
function saveFollow(req,res){
    var params = req.body;
    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed= params.followed;
    follow.save((err,followStored)=>{
        if(err) return res.status(500).send({message:'Error al guardar el seguimiento.'});
        if(!followStored) return res.status(404).send({message:'EL seguimiento no se ha guardado.'});
        return res.status(200).send({follow: followStored});
    });
}

/**
 * Elimina un seguimiento
 * @param req
 * @param res
 */
function deleteFollow(req,res){
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({'user': userId, 'followed': followId}).remove(err=> {
        if (err) return res.status(500).send({message:'Error al dejar de seguir.'});

        return res.status(200).send({message:'EL follow se ha eliminado.'});
    })
}

/**
 * Devuelve los usuarios seguidos por el usuario logueado, o por el usuario indicado en el parámetro :id
 * debidamente paginados. Además del total.
 * @param req
 * @param res
 */
function getFollowingUsers(req,res){
    var userId = req.user.sub;
    // Si se envia un id como url/:id lo usamos como usuario seguidor.
    // si no, usamos el usario logueado como usuario seguidor.
    if (req.params.id){
        userId = req.params.id;
    }
    var page = 1;

    if (req.params.page){
        page = req.params.page; // TODO Resolver problema de que sólo se indique página pero no :id
    }

    var itemsPerPage = 2;

    Follow.find({user: userId}).populate({'user followed'}).paginate(page,itemsPerPage,(err,follows,total)=>{
        if (err) return res.status(500).send({message:'Error en el servidor.'});
        if (!follows) return res.status(404).send({message:'No estás siguiendo a ningún usuario'});
        return res.status(200).send({
            total: total, // Total registros que devuelve el find
            pages: Math.ceil(total/itemsPerPage), // Math.ceil redondea al alza al entero superior (10/3=4)
            follows // Es lo mismo que follows:follows
        })
    })
}

function getFollowedUsers(req,res){
    var userId = req.user.sub;
    // Si se envia un id como url/:id lo usamos como usuario seguido.
    // si no, usamos el usario logueado como usuario seguido.
    if (req.params.id){
        userId = req.params.id;
    }
    var page = 1;

    if (req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({followed: userId}).populate({path: 'user'}).paginate(page,itemsPerPage,(err,follows,total)=>{
        if (err) return res.status(500).send({message:'Error en el servidor.'});
        if (!follows) return res.status(404).send({message:'No te sigue ningún usuario'});
        return res.status(200).send({
            total: total, // Total registros que devuelve el find
            pages: Math.ceil(total/itemsPerPage), // Math.ceil redondea al alza al entero superior (10/3=4)
            follows // Es lo mismo que follows:follows
        })
    })

}


module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers
}