'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var MessageSchema = Schema({
    text: String,
    viewed: String,
    created_at: String,
    //guarda el usuario que envia el mensaje
    emitter: { type: Schema.ObjectId, ref: 'User' },
    //guarda el id del usuario que recive el mensaje
    receiver: { type: Schema.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Message',MessageSchema);