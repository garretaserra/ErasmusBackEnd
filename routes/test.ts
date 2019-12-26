import express = require('express');
export let testRouter: express.Router = express.Router();
let testScripts = require('../controllers/testScripts');

testRouter.get('/get', testScripts.test);
testRouter.post('/post', testScripts.postSth);
testRouter.get('/posts/:userId', testScripts.getPosts);

export default testRouter;
