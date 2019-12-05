import express = require('express');
export let postRouter: express.Router = express.Router();
let auth = require('./auth');

let postScripts = require('./../controllers/postScripts');

postRouter.post('/newPost', auth.optional, postScripts.newPost);

export default postRouter;
