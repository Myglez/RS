'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');
const publication = require('../models/publication');

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

function getPosts(req,res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 4;

    Follow.find({user: req.user.sub}).populate('followed').exec((err,follows)=>{
        if(err) return res.status(500).send({message:'error al devolver el seguimiento'});

        var follows_clean = [];

        follows.forEach((follow)=>{
            follows_clean.push(follow.followed);
        });
        Publication.find({user: {"$in": follows_clean}}).sort('-created_at').populate('user').paginate(page,itemsPerPage,(err, publications, total)=>{
            if(err) return res.status(500).send({message:'error al devolver las publicaciones'});
            if(!publications) return res.status(404).send({message:'no hay publicaciones'});
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                publications
            });
        });
    });
}

function getPost(req, res){
    var publicationId = req.params.id;

    Publication.findById(publicationId,(err,publication)=>{
        if(err) return res.status(500).send({message:'error al devolver las publicaciones'});
        if(!publication) return res.status(404).send({message:'no hay publicaciones'});
        return res.status(200).send({publication});
    });
}

function deletePost(req, res){
    var publicationId = req.params.id;
    Publication.find({'user': req.user.sub,'_id': publicationId}).remove((err)=>{
        if(err) return res.status(500).send({message:'error al borrar publicacion'});
        return res.status(200).send({message: 'publicacion eliminada'});
    });
}

module.exports = {
    test,
    savePost,
    getPosts,
    getPost,
    deletePost
}