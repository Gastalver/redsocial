'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/pruebas-follow',md_auth.ensureAuth,FollowController.prueba);
api.get('/following/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowingUsers); //following
api.get('/followed/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowedUsers); //followed
api.post('/follow',md_auth.ensureAuth,FollowController.saveFollow);
api.delete('/follow/:id',md_auth.ensureAuth, FollowController.deleteFollow);


module.exports = api;