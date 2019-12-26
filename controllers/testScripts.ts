'use strict';
import User from '../models/user';
import user from "../models/user";
import Profile from "../models/profile";
let Base = require('../models/base');
let Post = require('../models/post');
let Evento = require('../models/event');

exports.test = async function (req, res){
    res.status(200).send('It works');
};

exports.postSth = async function (req,res){
    let body = req.body;
    switch (body.type) {
        case 'Post':
            let message = new Post(body);
            message.modificationDate = Date.now();
            message.save();
            return res.status(200).send(message);
        case 'Event':
            let event = new Evento(body);
            event.modificationDate = Date.now();
            event.save();
            return res.status(200).send(event);
    }
};

exports.getPosts = async function (req,res) {
    let userId = req.params.userId;
    let userFound = await User.findOne({_id:userId});
    if (!userFound) {
        return res.status(404).send({message: 'User not found'});
    } else {
    }
};

exports.getEvents = async function (req,res) {
    let userId = req.params.userId;
    let userFound = await User.findOne({_id:userId});
    if (!userFound) {
        return res.status(404).send({message: 'User not found'});
    } else {
    }
};
