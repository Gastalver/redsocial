'use strict';

var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// middleware de este subconjunto de rutas
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/publications'});


api.get('/probando', md_auth.ensureAuth, PublicationController.probando);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
api.get('/publications-user/:user/:page?', md_auth.ensureAuth, PublicationController.getPublicationsUser);
api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
api.post('/publication',md_auth.ensureAuth, PublicationController.savePublication);
api.delete('/publication/:id',md_auth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth,md_upload], PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile); // Más rápido sin autenticación

module.exports = api;