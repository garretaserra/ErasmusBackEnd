'use strict';
import User from '../models/user';
let Post = require('../models/post');

exports.newPost = async function(req, res, next) {
    console.log('req: ', req.body);
    let post = req.body.post;
    let userFound = await User.findById(post.owner);

    if (!userFound) {
        return res.status(404).send({message: 'User not found'})
    } else {
        let message = new Post(post);
        message.modificationDate = Date.now();
        message.save();
        return res.status(200).send({post:message});
    }
};

exports.modifyPost = async function(req, res, next) {
    let post = req.body.post;
    console.log(post);
    console.log(post._id);
    post = await Post.updateOne({_id:post._id},post);
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
    let post = await Post.findOne({_id:postId}).populate('owner', '_id name', null);
    if(!post){
        return res.status(404).send({message: 'Post not found'});
    } else {
        return res.status(200).send({post:post});
    }
};

exports.comment =  async function (req, res, next) {
    let postId = req.body.postId;
    let owner_id = req.body.owner_id;
    let message = req.body.message;

    let comment = {
        owner: owner_id,
        message: message
    };
     console.log(comment);
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
