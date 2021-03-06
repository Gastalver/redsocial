'use strict';

//var path = require('path');
//var fs = require('fs');
require('mongoose-pagination');

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

    var itemsPerPage = 4;

    Follow.find({user: userId})
        .populate({path: 'followed'})
        .paginate(page,itemsPerPage,(err,follows,total)=>{
            if (err) return res.status(500).send({message:'Error en el servidor.'});
            if (!follows) return res.status(404).send({message:'No estás siguiendo a ningún usuario'});
            followUserIds(req.user.sub)
                .then(
                    (value)=>{
                        return res.status(200).send({
                            total: total, // Total registros que devuelve el find
                            pages: Math.ceil(total/itemsPerPage), // Math.ceil redondea al alza al entero superior (10/3=4)
                            follows,
                            users_following: value.following,
                            users_follow_me: value.followed
                        })
                    }
                )
        })
}

function getFollowedUsers(req,res) {
    var userId = req.user.sub;
    // Si se envia un id como url/:id lo usamos como usuario seguido.
    // si no, usamos el usario logueado como usuario seguido.
    if (req.params.id) {
        userId = req.params.id;
    }
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({followed: userId})
        .populate({path: 'user'})
        .paginate(page, itemsPerPage, (err, follows, total) => {
            if (err) return res.status(500).send({message: 'Error en el servidor.'});
            if (!follows) return res.status(404).send({message: 'No te sigue ningún usuario'});
            followUserIds(req.user.sub)
                .then(
                    (value) => {
                    return res.status(200).send({
                        total: total, // Total registros que devuelve el find
                        pages: Math.ceil(total / itemsPerPage), // Math.ceil redondea al alza al entero superior (10/3=4)
                        follows,
                        users_following: value.following,
                        users_follow_me: value.followed
                    });
                });
        });

}

/**
 * Devolver lista de usuarios seguidos o que nos siguen
 * @param req
 * @param res
 */
function getMyFollows(req,res) {
    var userId = req.user.sub;

    var find = Follow.find({user: userId});

    if (req.params.followed) {
        find = Follow.find({followed: userId});
    }

    find
        .populate('user followed')
        .exec((err, follows) => {
        if (err) return res.status(500).send({message: 'Error en el servidor.'});
        if (!follows) return res.status(404).send({message: 'No sigues ningún usuario'});
        return res.status(200).send({follows});
    });
}

async function followUserIds(user_id){
    try{

        var following = await Follow.find({"user": user_id})
            .select({"_id":0, "__v":0, "user": 0})
            .exec()
            .then((follows)=>{return follows;});

        var followed = await Follow.find({"followed": user_id})
            .select({"_id":0, "__v":0, "followed": 0})
            .exec()
            .then((follows)=>{return follows;});

        // Procesamos array para quedarnos sólo con los valores de la propiedad followed.
        var follows_clean = [];
        following.forEach((follow)=>{
            follows_clean.push(follow.followed);
        });

        // Procesamos array para quedarnos sólo con los valores de la propiedad user.
        var followed_clean = [];
        followed.forEach((follow)=>{
            followed_clean.push(follow.user);
        });

        return {
            following: follows_clean,
            followed: followed_clean
        }

    }catch(err){
        throw new Error(err);  // Lanza un error que crea una excepción.
    }
}



module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
};