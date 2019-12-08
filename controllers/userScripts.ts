'use strict';
import User from '../models/user';

exports.login = async function(req, res, next) {
    const user = req.body;
    console.log("user:", req.body);

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

    await User.findOne({email: user.email}).populate('followers').populate('following').populate('posts').populate('activity').then((data)=> {
            let finalUser = data;
            if (!finalUser)
                return res.status(400).send('Not found');
            if (finalUser.validatePassword(finalUser.password)) {
                let jwt = finalUser.generateJWT();
                //TODO: remove fields that are not necessary for the frontend

                // finalUser.hash = undefined;
                // finalUser.salt = undefined;
                return res.status(200).json({jwt: jwt, user: finalUser});
            }
        }
    );
};

exports.register = async function (req, res){
    const user = req.body;
    console.log("user:", req.body);

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
    //TODO: Add name validation

    const finalUser = new User(user);
    finalUser.setPassword(user.password);
    console.log("User Validation: ", finalUser.password);
    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
};

exports.follow = async function (req,res) {
    let userId = req.body.userId;
    let followedId = req.body.followedId;

    console.log(`User --> ${userId}, StartedFollowing --> ${followedId}`);

    let userFound = await User.findById(userId);

    if (!userFound) {
        return res.status(404).send({message: 'User not found'})
    } else {
        let followedFound = await User.findById(followedId);
        console.log(followedFound.posts);
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

    console.log(`User --> ${userId}, StopFollowing --> ${followedId}`);

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

exports.search = async function(req, res) {
    let searchString: string = req.query.searchString;
    let pattern = new RegExp('^' + searchString);
    await User.find({"email": pattern}).then((users=>{
        res.status(200).json(users);
    }));
};
