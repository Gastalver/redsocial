'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// cargar rutas
var user_routes = require('./routes/user');

// middleware
    // exigido por bodyparser
    app.use(bodyParser.urlencoded({extended:false}));
    // COnfiguramos bodyparser para que transforme el body a json.
    app.use(bodyParser.json());

// cors

// rutas
app.use('/api', user_routes);


//exportar
module.exports = app;