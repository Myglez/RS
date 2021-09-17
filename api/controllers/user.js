'use strict'

var User = require('../models/user');

function home(req,res){
    res.status(200).send({
        message: 'pohvamoviendo'
    })
}

function test(req,res){
    res.status(200).send({
        message: 'thisIsAtest'
    })
}

module.exports = {
    home,
    test
}