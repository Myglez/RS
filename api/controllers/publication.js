'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function test(req,res){
    res.status(200).send({message:'this is a test from publication controller'});    
}

function savePost(req,res){
    var params = req.body;

    if(!params.text) return res.status(200).send({message:'escribe el mensaje'});

    var publication = new Publication();
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err,publicationStored)=>{
        if(err) return res.status(500).send({message:'error al guardar la publicacion'});
        if(!publicationStored) return res.status(404).send({message:'publicacion no ha sido guardada'});
        return res.status(200).send({publication: publicationStored});

    })
} 

module.exports = {
    test,
    savePost
}