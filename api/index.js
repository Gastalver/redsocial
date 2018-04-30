'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

// COnexión a base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/redsocial')
    .then(
        () =>{
            console.log('La conexión a la bd redsocial se ha realizado correctamente')

            //crear servidor
            app.listen(port,()=>{
                console.log('Servidor creado corriendo en http://localhost:3800');
            });
        }
    ).catch(err => console.log(err));


