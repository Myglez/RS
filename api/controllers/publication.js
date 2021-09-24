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

function uploadImage(req,res){
    var publicationId = req.params.id;

    if(req.files){
        // ruta del archivo
        var file_Path = req.files.image.path;
        // corta la ruta desde las "/" y lo convierte en un array
        var file_split = file_Path.split('/');
        //contiene el nombre del archivo
        var file_name = file_split[2];
        //toma el nombre y lo corta desde el "." y lo convierte en un array 
        var ext_split = file_name.split('.');

        //toma la extension del arreglo
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            //actualiza el documento de la publicacion
            Publication.findOne({'user':req.user.sub, '_id':publicationId}).exec((err, publication)=>{
                if(publication){

                    Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated)=>{

                        if(err) return res.status(500).send({message:'error en la peticion'});
                        if(!publicationUpdated) return res.status(404).send({message:'no se ha podido actualizar el usuario'});
                        return res.status(200).send({publication: publicationUpdated});
        
                    });
                }else{
                    return res.status(200).send({message:'no eres el dueño de esta publicacion'});
                }
            });
        }else{
            return removeFilesOfUploads(res, file_Path, 'extension no valida');
        }

    }else{
        return res.status(200).send({message:'no se han subido archivos'});
    }
}

function removeFilesOfUploads(res,file_Path,message){
    fs.unlink(file_Path, (err)=>{
        return res.status(200).send({message: message});
    });
}

function getImageFile(req,res){
    var image_file = req.params.imageFile
    var path_file = './uploads/publications/'+image_file;

    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'no existe la imagen'});
        }
    });
}

module.exports = {
    test,
    savePost,
    getPosts,
    getPost,
    deletePost,
    uploadImage,
    getImageFile
}