'use strict';
import mongoose = require('mongoose');
import passport = require('passport');

let User = require('./../models/user');

exports.login = async function(req, res, next) {
    //Get user data for login
    const { body: { user } } = req;
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
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }
        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.status(200).json({ user: user.toAuthJSON() });
        }
        return res.status(400).info;
    })
};

exports.register = async function (req, res){
    const { body: { user } } = req;

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

    const finalUser = new User(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
};
