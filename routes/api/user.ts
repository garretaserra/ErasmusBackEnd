import express = require('express');
let router: express.Router = express.Router();

let userScripts = require('../../controllers/userScripts');
let auth = require('../auth');


router.post('/register', auth.optional, userScripts.register);
router.post('/login', auth.optional, userScripts.login);
//Example of route that needs authentication
router.get('/user', auth.required, function (req, res){res.status(200).send({message: 'It works'})});

module.exports = router;
