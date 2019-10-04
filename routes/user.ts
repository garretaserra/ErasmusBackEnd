import express = require('express');
let router: express.Router = express.Router();

let userScripts = require('./../controllers/userScritps');

router.post('/register', userScripts.register);
router.post('/login', userScripts.login);

module.exports = router;
