'use strict'

var express = require('express');
var PublicationControler = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/publications'});

api.get('/pub-test',md_auth.ensureAuth, PublicationControler.test);
api.post('/publication',md_auth.ensureAuth, PublicationControler.savePost);

module.exports = api;