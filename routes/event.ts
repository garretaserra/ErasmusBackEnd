import express = require('express');
export let eventRouter: express.Router = express.Router();
let auth = require('./auth');

let eventScripts = require('./../controllers/eventScripts');

eventRouter.post('', auth.optional, eventScripts.newEvent);
eventRouter.delete('/:eventId', auth.optional, eventScripts.deleteEvent);

export default eventRouter;
