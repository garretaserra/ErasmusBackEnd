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

exports.deletePost = async function(req, res, next) {
    let postId = req.params.postId;
    let post = await Post.findByIdAndDelete(postId);
    if(!post){
        return res.status(404).send({message: 'Post not found'});
    } else {
        return res.status(200).send({message: 'Deleted successfully'});
    }
};
