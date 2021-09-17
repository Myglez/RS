'use strict'

const mongoose = require('mongoose');
var app = require('./app');
var port = 30800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/curso_mean_social')
        .then(() => {
            console.log("conexion establecida")
            //server
            app.listen(port,()=>{
                console.log("server listo en puerto: 30800")
            })

        })
        .catch(err => console.log(err));