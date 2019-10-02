'use strict';
const mongoose = require('mongoose');
let User = require('./../models/user');

exports.login = async function(req, res) {
    let user = req.body;

    //look for user
    let checkUser = await User.findOne({email: user.email});

    //User has been found
    if(checkUser){
        //Check password
        if(checkUser.password === user.password){
            res.status(200).send(checkUser);
            return;
        }
    }
    //Bad credentials
    res.status(400).send('Wrong credentials');
};

exports.register = async function (req, res){
    let user = req.body;

    //Check if user has been sent
    if(!user){
        console.log('Error: at register user has not been sent');
        res.status(400).send('User not sent');
        return;
    }

    //Check for existing users with same email
    let userFound = await User.findOne({email: user.email});
    if(userFound){
        console.log('Error: player with existing username ' + userFound.email + ' already exists');
        res.status(400).send('Error: player with existing username ' + userFound.email + ' already exists');
        return;
    }

    //Add user to database
    let newUser = new User(user);
    await newUser.save().then( user =>{
            console.log('User has been registered successfully\n'+user);
            res.status(200).send('User has been registered successfully\n'+user);
        }
    )

};

//esto es una novedad
