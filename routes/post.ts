import express = require('express');
export let postRouter: express.Router = express.Router();
let auth = require('./auth');

let postScripts = require('./../controllers/postScripts');

postRouter.post('', auth.optional, postScripts.newPost);
postRouter.delete('/:postId', auth.optional, postScripts.deletePost);

export default postRouter;
