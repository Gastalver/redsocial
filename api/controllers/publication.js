'use strict';

var path = require('path');
var fs = require('fs');
var moment = require('moment');
require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

/**
 * Prueba de controlador publication
 * @param req
 * @param res
 */
function probando(req,res){
    res.status(200).send({"message": "Hola desde el controlador de publicaciones"});
}

/**
 * Guardar publicación
 * @param req
 * @param res
 * @returns {*}
 */
function savePublication(req,res){
    var params = req.body;
    if(!params.text){
        return res.status(200).send({"message": "Debes enviar un texto."});
    }
    var publication = new Publication();
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();
    publication.save((err,publicationStored)=>{
        if(err) return res.status(500).send({"message": "Error al guardar la publicación"});
        if(!publicationStored){
            return res.status(404).send({"message": "La publicación no ha sido guardada"});
        }
        return res.status(200).send({publication: publicationStored});
    })

}

/**
 * Recibe lista de publicaciones de usuarios a los que sigue el usuario logueado.
 * @param req
 * @param res
 */
function getPublications(req,res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 4;

    Follow.find({user: req.user.sub})
        .populate('followed')
        .exec((err,follows)=>{
            if(err)return res.status(500).send({"message": "Error al devolver el seguimiento"});
            var follows_clean = [];
            follows.forEach((follow)=>{
                follows_clean.push(follow.followed);
            });

            Publication.find({user: {"$in": follows_clean}}) // userid = a alguno de los usersid contenidos en array follows_clean. Ahorra bucle.
                .sort('created_at')
                .populate('user')
                .paginate(page, itemsPerPage,(err,publications,total)=>{
                    if(err)return res.status(500).send({"message": "Error al devolver publicaciones"});
                    if(!publications){
                        return res.status(404).send({"message": "No hay publicaciones"});
                    }
                    res.status(200).send({
                        total_items: total,
                        publications,
                        pages: Math.ceil(total/itemsPerPage),
                        page:page
                    })

                });
        });
}

/**
 * Obtener una publicación por su Id.
 * @param req
 * @param res
 */
function getPublication(req,res){
    var publicationId = req.params.id;
    Publication.findById(publicationId,(err,publication)=>{
        if(err)return res.status(500).send({"message": "Error al buscar publicación"});
        if(!publication){
            return res.status(404).send({"message": "No existe la publicación"});
        }
        return res.status(200).send({publication});
        }
    )
}

/**
 * ELimina una publicación del usuario logueado
 * @param req
 * @param res
 */

function deletePublication(req,res){
    var publicationId = req.params.id;
    Publication.find({"user": req.user.sub, "_id": publicationId})
        .remove((err)=>{
        if(err)return res.status(500).send({"message": "Error al borrar publicación."});
        if(!publicationRemoved) {
            return res.status(404).send({"message": "No se ha borrado la publicación."});
        }
        return res.status(200).send({publication: "Publicación eliminada correctamente."});
        });
}

/**
 * Subir archivos de una publicación
 * @param req
 * @param res
 * @returns {*}
 */
function uploadImage(req,res){
    var publicationId = req.params.id;
    //console.log(req.files.image);

    if(req.files){  // TODO REVISAR req.files simplemente no detecta si no se ha subido un archivo.
        // Extraemos la dirección donde va a ser alojado el archivo - generada por connect-multipart
        var file_path = req.files.image.path;
        // -> Algo así como /uploads/users/nombrearchivogeneradopormultilpart.jpg
        // Dividimos la URL por el carácter \ -con barra de escape- y obtenemos un array de las partes.
        var file_split = file_path.split('\\');
        // -> [uploads, users, nombrearchivogeneradopormultilpart.jpg]
        // Tomamos el nombre del archivo, que estará en la posición 2 del array (que empieza por 0)
        var file_name = file_split[2];

        // Extraer extensión del archivo con el mismo método.
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];


        // Solo autorizamos la subida de imagenes del propio usuario
        //if(userId != req.user.sub){
          //  return removeFilesOfUploads(res,file_path,'No tienes permisos para actualizar los datos del usuario.');
        //}

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' ||file_ext == 'gif'){
            // Comprobamos que la publicación es del propio usuario, no de otro.
            Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err,publication)=>{
                if(publication){
                    Publication.findByIdAndUpdate(publicationId,{file: file_name},{new:true},(err,publicationUpdated)=>{
                        if(err) return res.status(500).send({message:'Error en la petición.'});
                        if(!publicationUpdated) return res.status(404).send({message:'No se ha podido actualizar la publicación.'});
                        return res.status(200).send({publication: publicationUpdated})
                    });
                } else {
                    return removeFilesOfUploads(res,file_path,'No tienes permiso para actualizar.');
                }
            });

            // Actualizamos documento de usuario logueado

        }else{
            // Borramos el archivo (porque connect-multipart siempre lo guarda y no lo borra y devolvemos directamente un mensaje
            return removeFilesOfUploads(res,file_path,'Extensión no válida');
        }
    } else {
        return res.status(200).send({message:'No se han subido imágenes.'}); //TODO Comprobar que (if req.files) detecta si no se manda archivo.
    }
}

/**
 * Elimina archivo subido por connect-multipart al uploadDir con el que
 * se ha configurado este middleware (cfr. /api/routes/user.js) en este caso /uploads/users/nombrefichero
 */
function removeFilesOfUploads(res,file_path,message){
    fs.unlink(file_path, (err)=> {
        return res.status(200).send({message: message});
    });
}

/**
 * Obtiene un archivo de imagen por su id.
 * @param req
 * @param res
 */
function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/' + image_file;
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message:'No existe la imagen'});
        }
    })
}



module.exports={
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile

}