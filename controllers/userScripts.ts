'use strict';
let User = require('../models/user');

exports.login = async function(req, res, next) {
    //Get user data for login
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

    await User.findOne({email: user.email}).populate('followers').populate('following').populate('posts').then((data)=> {
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
    const user= req.body;
    console.log("body: ", req.body);
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

exports.search = async function(req, res) {
    let searchString: string = req.query.searchString;
    let pattern = new RegExp('^' + searchString);
    await User.find({"email": pattern}).then((users=>{
        res.status(200).json(users);
    }));
};
