'use strict';
import User from '../models/user';
let Post = require('../models/post');

exports.newPost = async function(req, res, next) {
    let post = req.body.post;
    let userFound = await User.findById(post.owner_id);

    if (!userFound) {
        return res.status(404).send({message: 'User not found'})
    } else {
        let message = new Post(post);
        message.modificationDate = Date.now();
        message.save();
        return res.status(200).send({post:post});
    }
};

exports.modifyPost = async function(req, res, next) {
    let post = req.body.post;
    post = await Post.updateOne(post);
    if(post.n==0) {
        return res.status(404).send({message: 'Post not found'});
    } else {
        if(post.nModified==0){
            return res.status(304).send({message: 'Not modified'});
        } else {
            return res.status(200).send({post:post});
        }
    }
};

exports.deletePost = async function(req, res, next) {
    let postId = req.params.postId;
    let post = await Post.findByIdAndDelete(postId);
    if(!post){
        return res.status(404).send({message: 'Post not found'});
    } else {
        return res.status(200).send({message: 'Deleted successfully'});
    }
};

exports.getPost = async function (req, res, next) {
    let postId = req.params.postId;
    let post = await Post.findOne({_id:postId});
    if(!post){
        return res.status(404).send({message: 'Post not found'});
    } else {
        return res.status(200).send({post:post});
    }
};

exports.comment =  async function (req, res, next) {
    let postId = req.body.postId;
    let comment = req.body.comment;
    let post = await Post.updateOne({_id:postId},{$push:{comments:comment}});
    if(post.n==0){
        return res.status(404).send({message: 'Post not found'});
    } else {
        return res.status(200).send({message: 'Commented successfully'});
    }
};

exports.unComment =  async function (req, res, next) {
    let commentId = req.body.commentId;
    let postId = req.body.postId;
    let post = await Post.updateOne({_id: postId}, {$pull: {comments: {_id: commentId}}});
    console.log(post);
    if (post.n == 0) {
        return res.status(404).send({message: 'Post not found'});
    } else {
        if (post.nModified == 0) {
            return res.status(304).send({message: 'Comment does not exist'});
        } else {
            return res.status(200).send({message: 'Uncommented successfully'});
        }
    }
};
