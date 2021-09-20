'use strict'

var express = require('express');
var FollowConroller = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/follow', md_auth.ensureAuth, FollowConroller.saveFollow);

module.exports = api;