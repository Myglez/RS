'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function test(req,res){
    res.status(200).send({message: 'hello there'});
}

function saveMessage(req,res){
    var params = req.body
    
    if(!params.text || !params.receiver) return res.status(200).send({message: 'Campos vacios o invalidos'});

    var message = new Message

    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text
    message.created_at = moment().unix();

    message.save((err,MessageStored)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!MessageStored) return res.status(500).send({message: 'Error al enviar el mensaje'});
        return res.status(200).send({message: MessageStored});
    })
    
}

module.exports = {
    test,
    saveMessage
}