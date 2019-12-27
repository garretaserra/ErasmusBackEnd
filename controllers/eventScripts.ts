'use strict';
import User from '../models/user';
let Event = require('../models/event');

exports.newEvent = async function(req, res, next) {
    let event = req.body.event;
    let userFound = await User.findById(event.owner_id);

    if (!userFound) {
        return res.status(404).send({message: 'User not found'})
    } else {
        event = new Event(event);
        event.modificationDate = Date.now();
        event.save();
        return res.status(200).send({post:event});
    }
};

exports.deleteEvent = async function(req, res, next) {
    let eventId = req.params.eventId;
    let event = await Event.findByIdAndDelete(eventId);
    if(!event){
        return res.status(404).send({message: 'Event not found'});
    } else {
        return res.status(200).send({message: 'Deleted successfully'});
    }
};
