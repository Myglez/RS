'use strict'

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/curso_mean_social')
        .then(() => {
            console.log("conexion establecida")
        })
        .catch(err => console.log(err));