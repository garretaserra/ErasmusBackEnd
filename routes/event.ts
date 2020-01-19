import express = require('express');
export let eventRouter: express.Router = express.Router();
let auth = require('./auth');

let eventScripts = require('./../controllers/eventScripts');

eventRouter.post('', auth.required, eventScripts.newEvent);
eventRouter.delete('/:eventId', auth.required, eventScripts.deleteEvent);
eventRouter.put('', auth.required, eventScripts.modifyEvent);
eventRouter.get('/:eventId', auth.required, eventScripts.getEvent);
eventRouter.put('/join', auth.required, eventScripts.join);
eventRouter.put('/leave', auth.required, eventScripts.leave);

export default eventRouter;
