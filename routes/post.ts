import express = require('express');
import eventRouter from "./event";
export let postRouter: express.Router = express.Router();
let auth = require('./auth');

let postScripts = require('./../controllers/postScripts');

postRouter.post('', auth.optional, postScripts.newPost);
postRouter.delete('/:postId', auth.optional, postScripts.deletePost);
postRouter.get('/:postId', auth.optional, postScripts.getPost);
postRouter.put('/comment', auth.optional, postScripts.comment);
postRouter.put('/unComment', auth.optional, postScripts.unComment);

export default postRouter;
