'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// cargar rutas

// middleware
    // exigido por bodyparser
    app.use(bodyParser.urlencoded({extended:false}));
    // COnfiguramos bodyparser para que transforme el body a json.
    app.use(bodyParser.json());


// cors

// rutas
app.get('/',(req,res)=>{
    res.status(200).send(
        {
            message: 'Hola mundo'
        }
    )
})


//exportar
module.exports = app;