import express = require('express');
export let userRouter: express.Router = express.Router();

let userScripts = require('./../controllers/userScripts');
let auth = require('./auth');

userRouter.post('/register', auth.optional, userScripts.register);
userRouter.post('/login', auth.optional, userScripts.login);
userRouter.get('/all/:userId?', auth.required, userScripts.getAll);
userRouter.put('/follow', auth.required, userScripts.follow);
userRouter.put('/unfollow',auth.required, userScripts.unFollow);
userRouter.get('/user', auth.optional, function (req, res){res.status(200).send({message: 'It works'})});
userRouter.put('/activity/:userId/:slice', auth.required, userScripts.updateActivity);
userRouter.get('/profile/:userId', auth.required, userScripts.getProfile);
userRouter.get('/followers/:userId', auth.required, userScripts.getFollowers);
userRouter.get('/following/:userId', auth.required, userScripts.getFollowing);
userRouter.get('/posts/:userId/:slice', auth.required, userScripts.getPosts);
userRouter.get('/events/:userId/:slice', auth.required, userScripts.getEvents);
userRouter.get('/events/:userId', auth.required, userScripts.getEventsFromUser);
userRouter.get('/search', auth.required, userScripts.search);
userRouter.post('/image/edit', auth.required, userScripts.editImage);
userRouter.get('/image', auth.required, userScripts.getImage);
userRouter.delete('/:userId', auth.required, userScripts.dropOut);
userRouter.post('/message', auth.required, userScripts.postMessage);
userRouter.get('/messages/:userId', auth.required, userScripts.getMessages);
userRouter.get('/notifications/:userId', auth.optional, userScripts.getNotifications);
//Receiver wants to ACK senders' messages
userRouter.put('/message/:senderId/:receiverId', auth.optional, userScripts.ackMessages);
userRouter.put('/erasmusInfo/:userId', auth.optional, userScripts.addErasmusInfo);
//userRouter.get('/otherProfile/:userId', auth.optional, userScripts.getOtherProfile);

export default userRouter;
