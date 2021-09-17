'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//load rutas

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

//cores

//rutas
app.get('/test',(req,res)=>{
    res.status(200).send({
        message: 'pohvamoviendo'
    })
})
//export
module.exports = app;