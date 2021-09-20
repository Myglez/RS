'use strict'

var express = require('express');
var FollowConroller = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/follow', md_auth.ensureAuth, FollowConroller.saveFollow);
api.delete('/follow/:id', md_auth.ensureAuth, FollowConroller.unFollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowConroller.getFollowingUsers);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowConroller.getFollewedUsers);

module.exports = api;