'use strict';
import User from '../models/user';
import Post from '../models/post';

exports.newPost = async function(req, res, next) {
    let userId = req.body.userId;
    let post = new Post(req.body.post);

    console.log(`New post --> UserID: ${userId}, Post: ${post}`);

    let userFound = await User.findById(userId).populate('followers');

    if (!userFound) {
        return res.status(404).send({message: 'User not found'})
    } else {
        await User.findOneAndUpdate({_id: userId}, {$addToSet:{posts: post._id, activity: post._id}});
        for(let i = 0; i < userFound.followers.length;i++){
            await User.updateOne({_id: userFound.followers[i]._id}, {$addToSet: {activity: post._id}});
        }
        return post.save()
            .then(() => res.status(200).send({post:post}));
    }
};

exports.deletePost = async function(req, res, next) {
    let postId = req.params.postId;
    console.log(postId);
    let post = await Post.findByIdAndDelete(postId);
    if(!post){
        return res.status(404).send({message: 'Post not found'});
    }else {
        await User.updateMany({}, {$pull: {posts: postId, activity: postId}}, {multi: true});
        return res.status(200).send({message: 'Delete successfully'});
    }
};
