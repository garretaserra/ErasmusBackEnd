let express = require('express');
let router = express.Router();

let userScripts = require('./../controllers/userScritps');

router.post('/register', userScripts.register);

module.exports = router;
