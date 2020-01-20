'use strict';
import {Request, Response} from  'express';
import User from '../models/user';
import Profile from '../models/profile';
import Message from '../models/message';
import AuthUser from '../models/authUser';
import {UserRegister} from "../../ErasmusApp/src/app/models/User/userRegister";
let Post = require('../models/post');
let Event = require('../models/event');
let Base = require('../models/base');
let ObjectId = require('mongodb').ObjectID;

exports.login = async function(req, res, next) {
    let user = req.body;

    let foundUser = await User.findOne({email: user.email});

    if (!foundUser)
        return res.status(404).send('User not found');
    else{
        if(foundUser.validatePassword(user.password)){
            let jwt = foundUser.generateJWT();
            let finalUser = new AuthUser(foundUser._id,foundUser.email,foundUser.name,foundUser.activity);
            return res.status(200).json({jwt: jwt, user: finalUser});
        }
        else {
            return res.status(401).send('Bad password');
        }
    }
};

exports.register = async function (req, res){
    let user = req.body;

    let foundUser = await User.findOne({email:user.email});

    if(foundUser) return res.status(409).json({message: "Existent User"});
    else {
        let newUser = new User(user);
        newUser.setPassword(user.password);
        return newUser.save()
            .then(() => res.status(200).json({
                jwt: newUser.generateJWT(),
                user: newUser.toAuthJSON()
            }));
    }
};

exports.getAll = async function(req, res) {
    let userId = req.params.userId;

    let users = await User.find({_id:{$nin:userId}}, {name:1});

    return res.status(200).send(users);
};

exports.getProfile = async function(req,res) {
    let userId = req.params.userId;

    let userFound = await User.findById(userId);

    if (!userFound) {
        return res.status(404).send({message: 'User not found'});
    } else {
        let posts = await Post.countDocuments({owner: userId});
        let events = await Event.countDocuments({owner: userId});
        let profile = new Profile(userFound._id, userFound.email, userFound.name, userFound.followers.length, userFound.following.length, posts, events);
        return res.status(200).send({profile: profile});
    }
};

exports.getFollowers = async function(req, res) {
    let userId = req.params.userId;

    let followers = await User.findOne({ _id:userId },{ _id:0, followers:1 })
        .populate('followers', '_id name', null);

    if (!followers) {
        return res.status(404).send({message: 'User not found'});
    } else {
        return res.status(200).send(followers);
    }
};

exports.getFollowing = async function(req, res) {
    let userId = req.params.userId;

    let following = await User.findOne({ _id:userId },{ _id:0, following:1 })
        .populate('following', '_id name', null);

    if (!following) {
        return res.status(404).send({message: 'User not found'});
    } else {
        return res.status(200).send(following);
    }
};

exports.getPosts = async function(req, res) {
    let userId = req.params.userId;
    let slice = +req.params.slice;

    let posts = await Post.find({owner: userId})
        .populate('owner', '_id name', null)
        .populate('comments.owner','_id name')
        .sort( {modificationDate: -1 })
        .skip(slice)
        .limit(10);

    if (!posts) {
        return res.status(404).send({message: 'User not found'});
    } else {
        return res.status(200).send({posts:posts});
    }
};

exports.getEvents = async function(req, res) {
    let userId = req.params.userId;
    let slice = +req.params.slice;

    let events = await Event.find({owner: userId})
        .populate('members', '_id name', null)
        .populate('owner', '_id name', null)
        .sort( {modificationDate: -1 })
        .skip(slice)
        .limit(10);

    if (!events) {
        return res.status(404).send({message: 'User not found'});
    } else {
        return res.status(200).send({events:events});
    }
};

exports.follow = async function (req,res) {
    let userId = req.body.userId;
    let followedId = req.body.followedId;

    let userFound = await User.findById(userId);

    if (!userFound) {
        return res.status(404).send({message: 'User not found'})
    } else {
        let followedFound = await User.findById(followedId);
        if (!followedFound) {
            return res.status(404).send({message: 'Followed not found'})
        } else {
            await User.updateOne({_id: followedId}, {$addToSet: {followers: userId}});
            await User.updateOne({_id: userId}, {$addToSet: {following: followedId, activity: followedFound.posts }});
            return res.status(200).send({message: 'Followed successfully'});
        }
    }
};

exports.unFollow = async function (req,res) {
    let userId = req.body.userId;
    let followedId = req.body.followedId;

    let userFound = await User.findById(userId);

    if (!userFound) {
        return res.status(404).send({message: 'User not found'})
    } else {
        let followedFound = await User.findById(followedId);
        if (!followedFound) {
            return res.status(404).send({message: 'Followed not found'})
        } else {
            await User.updateOne({_id: followedId}, {$pull: {followers: userId}});
            await User.updateOne({_id: userId}, {$pull: {following: followedId}});
            for(let i = 0; i < followedFound.posts.length;i++){
                await User.updateOne({_id: userId}, {$pull: {activity: followedFound.posts[i]}});
            }
            return res.status(200).send({message: 'UnFollowed successfully'});
        }
    }
};

exports.getEventsFromUser = async function(req, res) {
    let userId = req.params.userId;
    let user = await User.findOne({_id: userId});
    if (!user) {
        return res.status(404);
    }
    let list = new Array<string>();
    user.following.forEach((following) => list.push(following));
    list.push(userId);
    let result = await Event.find({members: {$in:list}})
        .populate('members', '_id name', null)
        .populate('owner', '_id name', null)
        .populate('comments.owner','_id name', null);
    if (result.length == 0) {
        return res.status(204);
    } else {
        return res.status(200).json(result);
    }
};

exports.updateActivity = async function(req, res) {
    let userId = req.params.userId;
    let slice = +req.params.slice;

    let userFound = await User.findOne({_id:userId});

    if (!userFound) {
        return res.status(404).send({message: 'User not found'});
    } else {
        let fetch = new Array<any>();
        userFound.following.forEach(following => fetch.push(following));
        fetch.push(userId);
        let result = await Base.find({owner: {$in:fetch}})
            .populate('members', '_id name', null)
            .populate('owner', '_id name profilePhoto', null)
            .populate('comments.owner','_id name', null)
            .sort( {modificationDate: -1 })
            .skip(slice)
            .limit(10);
        if(result.length==0) {
            return res.status(204).send({message:'Empty list'});
        } else {
            return res.status(200).send({activity: result});
        }
    }
};

exports.search = async function(req, res) {
    let searchString: string = req.query.searchString;
    let pattern = new RegExp('^' + searchString);

    await User.find({"email": pattern}).then((users=>{
        res.status(200).json(users);
    }));
};

exports.dropOut = async function (req, res) {
    let userId = req.params.userId;

    let userFound = await User.findByIdAndDelete(userId);

    if(!userFound){
        return res.status(404).send({message: 'User not found'});
    } else {
        await User.updateMany({}, {$pull: {followers: userId, following: userId}}, {multi: true});
        await Base.deleteMany({owner:userId}, {multi: true});
        return res.status(200).send({message: 'Dropped out successfully'});
    }
};

exports.editImage = async function(req, res) {
    let image = req.body.photo;
    let id = req.body.id;
    let result = await User.updateOne({_id: ObjectId(id)}, {profilePhoto: image});
    res.status(200).send({result: result});
};

exports.getImage = async function(req, res){
    let id = req.query.id;
    let user = await User.findById(id);
    res.status(200).send({photo: user.profilePhoto});
};

exports.getMessages = async function(req: Request, res: Response) {
    let userId: string = req.params.userId;
    let messages = await Message.find({$or: [{'author': userId}, {'destination': userId}, {'destination': 'everyone'}]});
    if (messages) {
        return res.status(200).json(messages);
    } else {
        return res.status(404).send('Not Found');
    }
};

exports.postMessage = async function(req: Request, res: Response) {
    const author: string = req.body.author;
    const destination: string = req.body.destination;
    const text: string = req.body.text;
    const timestamp: Date = new Date();
    const read: Boolean = false;

    const msg = new Message({author, destination, text, timestamp, read});
    await msg.save().then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
        console.log(err);
    })
};

exports.ackMessages = async function(req: Request, res: Response) {
    const senderId: string = req.params.senderId;
    const receiverId: string = req.params.receiverId;

    await Message.updateMany({ author: senderId, destination: receiverId }, { read: true }).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
        console.log(err);
    });
};

exports.addErasmusInfo = async function(req, res) {
    let userId = req.params.userId;
    let info = req.body.info;

    let result = await User.updateOne({_id:userId},{$set:info});
    let user = await User.find({_id:userId});
    if(result.n==0) {
        return res.status(404).send({message:'User not found'});
    } else {
        return res.status(200).send({user:user});
    }
};
