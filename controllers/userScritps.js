'use strict';
const mongoose = require('mongoose');
let User = require('./../models/user');

exports.login = async function(req, res) {

};

exports.register = async function (req, res){
    let user = req.body;

    //Check if user has been sent
    if(!user){
        console.log('Error: at register user has not been sent');
        res.status(400).send('User not sent');
    }

    //Check for existing users with same email
    let userFound = await User.findOne({email: user.email});
    if(userFound){
        console.log('Error: player with existing username ' + userFound.email + ' already exists');
        res.status(400).send('Error: player with existing username ' + userFound.email + ' already exists');
    }

    //Add user to database
    let newUser = new User(user);
    await newUser.save().then( user =>{
            console.log('User has been registered successfully\n'+user);
            res.status(200).send('User has been registered successfully\n'+user);
        }
    )

};
