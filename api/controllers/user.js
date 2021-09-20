'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var User = require('../models/user');
var jwt = require('../services/jwt');


function home(req,res){
    res.status(200).send({
        message: 'superHome'
    })
}

function test(req,res){
    console.log(req.body)
    res.status(200).send({
        message: 'thisIsAtest'
    })
}

function saveUser(req,res){
    var params = req.body;
    var user = new User();

    if(params.name && params.surname && params.nick && params.email && params.password){

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        //control de usuarios duplicados
        User.find({$or: [
            {email: user.email.toLowerCase()},
            {nick: user.nick.toLowerCase()}
        ]}).exec((err,users)=>{
            if(err) return res.status(500).send({message: ' error'});

            if(users && users.length >= 1){
                return res.status(200).send({message: 'El usuario ya existe'});
            }else{
                //cifra el password y guarda los datos
                bcrypt.hash(params.password, null, null,(err,hash)=>{
                    user.password = hash;

                    user.save((err,userStored)=>{
                        if(err) return res.status(500).send({message: 'error al guardar usuario'});

                        if(userStored){
                            res.status(200).send({user: userStored});
                        }else{
                            res.status(404).send({message: 'no se ha registrado el usuario'});
                        }
                    })
                })
            }
        });

    }else{
        res.status(200).send({
            message: 'asegurate de llenar todos los campos'
        });
    }
}

function loginUser(req,res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email},(err,user) =>{

        if(err) return res.status(500).send({message: 'error en la peticion'});

        if(user){
            bcrypt.compare(password, user.password,(err,check) =>{
                if(check){
                    if(params.gettoken){
                        //crear token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }else{
                        // traer datos ignorando el password
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                }else{
                    return res.status(404).send({message: 'error usuario o contraseña incorrectas'});
                }
            });
        }else{
            return res.status(404).send({message: 'error usuario incorrecto'});
        }
    });  
}

function getUser(req,res){
    var userId = req.params.id;

    User.findById(userId, (err, user) => {        
        if(err) return res.status(500).send({message: 'error en la peticion'});

        if(!user) return res.status(404).send({message: 'el usuario no existe'});

        return res.status(200).send({user}); 
    })
}

function getUsers(req,res){
    var identity_user_id = req.user.sub;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 5;
    User.find().sort('_id').paginate(page,itemsPerPage,(err,users,total)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'});

        if(!users) return res.status(404).send({message:'no hay usuarios disponibles'});

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        })
    });
}

function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;
    // borrar prpiedad password
    delete update.password;
    if(userId != req.user.sub){
        res.status(500).send({message:'no tienes los permisos necesarios'});
    }
    User.findByIdAndUpdate(userId, update, {new: true}, (err,userUpdated)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(!userUpdated) return res.status(404).send({message:'no se ha podido actualizar el usuario'});
        return res.status(200).send({user: userUpdated});
    })
}

function uploadImage(req,res){
    var userId = req.params.id;

    if(req.files){
        // ruta del archivo
        var file_Path = req.files.image.path;
        // corta la ruta desde las "/" y lo convierte en un array
        var file_split = file_Path.split('/');
        //contiene el nombre del archivo
        var file_name = file_split[2];
        //toma el nombre y lo corta desde el "." y lo convierte en un array 
        var ext_split = file_name.split('.');

        if(userId != req.user.sub){
            return removeFilesOfUploads(res, file_Path, 'no tienes los permisos necesarios');
        }

        //toma la extension del arreglo
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            //actualiza el documento de usuario logeado
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated)=>{

                if(err) return res.status(500).send({message:'error en la peticion'});
                if(!userUpdated) return res.status(404).send({message:'no se ha podido actualizar el usuario'});
                return res.status(200).send({user: userUpdated});
            })
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

module.exports = {
    home,
    test,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage
}