'use strict';

import User from '../models/user';
import Profile from '../models/profile';
import AuthUser from '../models/authUser';
let Post = require('../models/post');
let Event = require('../models/event');
let Base = require('../models/base');

exports.login = async function(req, res, next) {
    let user = req.body;
    if(!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }
    if(!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }
    let foundUser = await User.findOne({email: user.email});
    if (!foundUser)
        return res.status(404).send('User not found');
    else{
        if(foundUser.validatePassword(user.password)){
            let jwt = foundUser.generateJWT();
            let finalUser = new AuthUser(foundUser._id,foundUser.name,foundUser.email,foundUser.activity);
            return res.status(200).json({jwt: jwt, user: finalUser});
        }
        else {
            return res.status(401).send('Bad password');
        }
    }
};

exports.register = async function (req, res){
    let user = req.body;
    if(!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }
    if(!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }
    let foundUser = await User.findOne({email:user.email});
    if(foundUser) return res.status(409).json({message: "Existant User"});
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
    let users = await User.find({}, {name:1});
    return res.status(200).send(users);
};

exports.getProfile = async function(req,res) {
    let userId = req.params.userId;
    let userFound = await User.findById(userId);
    if (!userFound) {
        return res.status(404).send({message: 'User not found'});
    } else {
        let posts = await Post.countDocuments({owner_id: userId});
        let events = await Event.countDocuments({owner_id: userId});
        let profile = new Profile(userFound._id, userFound.email, userFound.name, userFound.followers.length, userFound.following.length, posts, events);
        return res.status(200).send({profile: profile});
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
        let result = await Base.find({owner_id: {$in:fetch}}).sort( {modificationDate: -1 }).skip(slice).limit(10);
        if(result.length==0) {
            return res.status(204).send({message:'Empty list'});
        } else {
            return res.status(200).send({activity: result});
        }
    }
};

exports.getFollowers = async function(req, res) {
    let userId = req.params.userId;
    let followers = await User.findOne({ _id:userId },{ _id:0, followers:1 }).populate('followers', '_id name', null);
    if (!followers) {
        return res.status(404).send({message: 'User not found'});
    } else {
        return res.status(200).send(followers);
    }
};

exports.getFollowing = async function(req, res) {
    let userId = req.params.userId;
    let following = await User.findOne({ _id:userId },{ _id:0, following:1 }).populate('following', '_id name', null);
    if (!following) {
        return res.status(404).send({message: 'User not found'});
    } else {
        return res.status(200).send(following);
    }
};

exports.getPosts = async function(req, res) {
    let userId = req.params.userId;
    let slice = +req.params.slice;
    let posts = await Post.find({owner_id: userId}).sort( {modificationDate: -1 }).skip(slice).limit(10);
    if (!posts) {
        return res.status(404).send({message: 'User not found'});
    } else {
        return res.status(200).send({posts:posts});
    }
};

exports.getEvents = async function(req, res) {
    let userId = req.params.userId;
    let slice = +req.params.slice;
    let events = await Event.find({owner_id: userId}).sort( {modificationDate: -1 }).skip(slice).limit(10);
    if (!events) {
        return res.status(404).send({message: 'User not found'});
    } else {
        return res.status(200).send({events:events});
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
        await Base.deleteMany({owner_id:userId}, {multi: true});
        return res.status(200).send({message: 'Dropped out successfully'});
    }
};
