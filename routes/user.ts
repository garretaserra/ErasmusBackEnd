import express = require('express');
export let userRouter: express.Router = express.Router();

let userScripts = require('./../controllers/userScripts');
let auth = require('./auth');

userRouter.post('/register', auth.optional, userScripts.register);
userRouter.post('/login', auth.optional, userScripts.login);
userRouter.put('/follow', auth.optional, userScripts.follow);
userRouter.put('/unfollow',auth.optional, userScripts.unFollow);
userRouter.get('/user', auth.required, function (req, res){res.status(200).send({message: 'It works'})});
userRouter.get('/usersName', auth.optional, userScripts.getUsersName);
userRouter.put('/activity/:userId', auth.optional, userScripts.updateActivity);
userRouter.get('/profile/:userId', auth.optional, userScripts.getProfile);
userRouter.get('/search', userScripts.search);

export default userRouter;

