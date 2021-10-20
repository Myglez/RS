'use strict'
var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/message-test',md_auth.ensureAuth, MessageController.test);
api.post('/message',md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?',md_auth.ensureAuth, MessageController.getMessages);
api.get('/my-send-messages/:page?',md_auth.ensureAuth, MessageController.getSendMessages);
api.get('/unread-messages',md_auth.ensureAuth, MessageController.countUnreadMessages);

module.exports = api;