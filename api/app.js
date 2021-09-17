'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//load rutas
var user_routes = require('./routes/user')

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

//cores

//rutas
app.use('/api',user_routes);

//export
module.exports = app;