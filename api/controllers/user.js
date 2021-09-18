'use strict'

var bcrypt = require('bcrypt-nodejs');
var user = require('../models/user');
//var User = require('../models/user');
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

    user.findOne({email: email},(err,user) =>{

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

module.exports = {
    home,
    test,
    saveUser,
    loginUser
}