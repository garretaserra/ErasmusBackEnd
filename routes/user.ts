import express = require('express');
export let userRouter: express.Router = express.Router();

let userScripts = require('./../controllers/userScripts');
let auth = require('./auth');

userRouter.post('/register', auth.optional, userScripts.register);
userRouter.post('/login', auth.optional, userScripts.login);
userRouter.get('/all/:userId?', auth.optional, userScripts.getAll);
userRouter.put('/follow', auth.optional, userScripts.follow);
userRouter.put('/unfollow',auth.optional, userScripts.unFollow);
userRouter.get('/user', auth.required, function (req, res){res.status(200).send({message: 'It works'})});
userRouter.put('/activity/:userId/:slice', auth.optional, userScripts.updateActivity);
userRouter.get('/profile/:userId', auth.optional, userScripts.getProfile);
userRouter.get('/followers/:userId', auth.optional, userScripts.getFollowers);
userRouter.get('/following/:userId', auth.optional, userScripts.getFollowing);
userRouter.get('/posts/:userId/:slice', auth.optional, userScripts.getPosts);
userRouter.get('/events/:userId/:slice', auth.optional, userScripts.getEvents);
userRouter.get('/search', userScripts.search);
userRouter.post('/image/edit', auth.optional, userScripts.editImage);
userRouter.get('/image', auth.optional, userScripts.getImage);
userRouter.delete('/:userId', userScripts.dropOut);
userRouter.post('/message', auth.optional, userScripts.postMessage);
userRouter.get('/messages/:userId', auth.optional, userScripts.getMessages);
userRouter.get('/notifications/:userId', auth.optional, userScripts.getNotifications);
userRouter.post('/notification', auth.optional, userScripts.postNotification);
//Receiver wants to ACK senders' messages
userRouter.put('/message/:senderId/:receiverId', auth.optional, userScripts.ackMessages);
userRouter.put('/erasmusInfo/:userId', auth.optional, userScripts.addErasmusInfo);
//userRouter.get('/otherProfile/:userId', auth.optional, userScripts.getOtherProfile);

export default userRouter;
