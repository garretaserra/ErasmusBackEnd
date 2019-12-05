import express = require('express');
export let userRouter: express.Router = express.Router();

let userScripts = require('./../controllers/userScripts');
let auth = require('./auth');

userRouter.post('/register', auth.optional, userScripts.register);
userRouter.post('/login', auth.optional, userScripts.login);
//Example of route that needs authentication
userRouter.get('/user', auth.required, function (req, res){res.status(200).send({message: 'It works'})});

export default userRouter;

