import express = require('express');
export let universityRouter: express.Router = express.Router();
let universityScripts = require('../controllers/universityScripts');

universityRouter.get('/all', universityScripts.getAll);

export default universityRouter;
