'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

// Conexión a base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/redsocial')
    .then(
        () =>{
            console.log('La conexión a la bd redsocial se ha realizado correctamente');

            //crear servidor
            app.listen(port,()=>{
                console.log('Servidor creado corriendo en http://localhost:3800');
            });
        },
        (err) =>{
            // Error: La conexión a fallado. El servidor BD puede estar caido.
            console.log('Algo ha fallado al conectar a la BD: ' + err)
        }
    ).catch(err => console.log(err));


