'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req,res){
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    Follow.save((err,followStored)=>{
        if(err) return res.status(500).send({message: 'error al guardar'});
        if(!followStored) return res.status(404).send({message: 'follow no se ha guardado'});
        return res.status(200).send({follow: followStored});
    });
}

function unFollow(req,res){
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({'user':userId, 'followed':followId}).remove((err)=>{
        if(err) return res.status(500).send({message: 'error accion no disponible'});
        return res.status(200).send({message: 'follow eliminado'});
    })
}

function getFollowingUsers(req,res){
    var userId = req.user.sub;

    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }
    var itemsPerPage = 4;
    Follow.find({user:userId}).populate({path:'followed'}).paginate(page, itemsPerPage, (err, follows, total)=>{
        if(err) return res.status(500).send({message: 'error en el servidor'});
        if(!follows) return res.status(404).send({message:'no estas siguiendo ningun usuario'});
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        })
    });
}

function getFollewedUsers(req, res){
    var userId = req.user.sub;

    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }
    var itemsPerPage = 4;
    Follow.find({followed:userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total)=>{
        if(err) return res.status(500).send({message: 'error en el servidor'});
        if(!follows) return res.status(404).send({message:'no tienes seguidores'});
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        })
    });
}

function getMyFollows(req,res){
    var userId = req.user.sub;
    var find = Follow.find({user:userId});

    if(req.params.followed){
        find = Follow.find({followed:userId});
    }
    find.populate('user followed').exec((err,follows)=>{
        if(err) return res.status(500).send({message: 'error en el sevidor'});
        if(!follows) return res.status(404).send({message:'no sigues ningun usuario'});
        return res.status(202).send({follows});
    })
}

module.exports = {
    saveFollow,
    unFollow,
    getFollowingUsers,
    getFollewedUsers,
    getMyFollows
}