'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated'); 

api.get('/home',UserController.home);
api.get('/test',md_auth.ensureAuth, UserController.test);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth, UserController.getUser);
module.exports = api;