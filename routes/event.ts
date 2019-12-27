import express = require('express');
export let eventRouter: express.Router = express.Router();
let auth = require('./auth');

let eventScripts = require('./../controllers/eventScripts');

eventRouter.post('', auth.optional, eventScripts.newEvent);
eventRouter.delete('/:eventId', auth.optional, eventScripts.deleteEvent);
eventRouter.put('', auth.optional, eventScripts.modifyEvent);
eventRouter.get('/:eventId', auth.optional, eventScripts.getEvent);
eventRouter.put('/join', auth.optional, eventScripts.join);
eventRouter.put('/leave', auth.optional, eventScripts.leave);

export default eventRouter;
