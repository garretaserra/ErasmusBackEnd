import express = require('express');
export let testRouter: express.Router = express.Router();
let testScripts = require('../controllers/testScripts');

testRouter.get('/get', testScripts.test);

export default testRouter;
