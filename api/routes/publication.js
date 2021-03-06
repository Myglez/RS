'use strict'

var express = require('express');
var PublicationControler = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/publications'});

api.get('/pub-test',md_auth.ensureAuth, PublicationControler.test);
api.post('/publication',md_auth.ensureAuth, PublicationControler.savePost);
api.get('/publications/:page?',md_auth.ensureAuth, PublicationControler.getPosts);
api.get('/publication/:id',md_auth.ensureAuth, PublicationControler.getPost);
api.delete('/publication/:id',md_auth.ensureAuth, PublicationControler.deletePost);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth,md_upload],PublicationControler.uploadImage);
api.get('/get-image-pub/:id',PublicationControler.getImageFile);

module.exports = api;