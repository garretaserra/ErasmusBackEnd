import express = require('express');
let router: express.Router = express.Router();

let testScripts = require('../controllers/testScripts');

router.get('/get', testScripts.test);
router.post('/post', testScripts.add);

module.exports = router;
