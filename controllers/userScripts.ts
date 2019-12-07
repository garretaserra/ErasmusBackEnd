'use strict';
import User from '../models/user';

exports.login = async function(req, res, next) {
    //Get user data for login
    const user = req.body.user;

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
    const user= req.body.user;
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
    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
};
