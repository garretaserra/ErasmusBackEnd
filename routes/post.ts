import express = require('express');
import eventRouter from "./event";
export let postRouter: express.Router = express.Router();
let auth = require('./auth');

let postScripts = require('./../controllers/postScripts');

postRouter.post('', auth.required, postScripts.newPost);
postRouter.delete('/:postId', auth.required, postScripts.deletePost);
postRouter.get('/:postId', auth.required, postScripts.getPost);
postRouter.put('/comment', auth.required, postScripts.comment);
postRouter.put('/unComment', auth.required, postScripts.unComment);

export default postRouter;
