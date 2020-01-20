'use strict';
import User from '../models/user';
let Post = require('../models/post');
let Notification = require('../models/notification');

exports.newPost = async function(req, res, next) {
    let post = req.body.post;

    let userFound = await User.findById(post.owner);

    if (!userFound) {
        return res.status(404).send({message: 'User not found'})
    } else {
        post = new Post(post);
        post.modificationDate = Date.now();
        post = await post.save();
        await makeNotificationForPost(post, userFound);

        return res.status(200).send({post:post});
    }
};

async function makeNotificationForPost(post: any, owner: any) {
    let notification = new Notification();
    notification.author = owner.name;
    notification.type = 'post';
    notification.goToUrl = '/comments/'+post._id;
    notification.text = owner.name + ' ha publicado un post.';
    notification = await notification.save();

    owner.followers.forEach(async followerId=>{
        await User.updateOne({_id:followerId._id},{$push:{notifications: notification._id}});
    });
}

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

    let post = await Post.findOne({_id:postId})
        .populate('owner', '_id name', null)
        .populate('comments.owner','_id name', null);

    if(!post){
        return res.status(404).send({message: 'Post not found'});
    } else {
        return res.status(200).send({post:post});
    }
};

exports.comment =  async function (req, res, next) {
    let postId = req.body.postId;
    let owner = req.body.owner;
    let message = req.body.message;

    let comment = {
        owner: owner,
        message: message
    };

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
