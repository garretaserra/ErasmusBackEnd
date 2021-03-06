'use strict';
import User from '../models/user';
let Event = require('../models/event');

exports.newEvent = async function(req, res, next) {
    let event = req.body.event;

    let userFound = await User.findById(event.owner);

    if (!userFound) {
        return res.status(404).send({message: 'User not found'})
    } else {
        event = new Event(event);
        event.modificationDate = Date.now();
        await event.save();
        await Event.findOneAndUpdate({_id:event._id},{$addToSet:{members:event.owner}});
        return res.status(200).send({event:event});
    }
};

exports.modifyEvent = async function(req, res, next) {
    let eventId = req.body.eventId;

    let newDescription = req.body.newDescription;
    let newDate = req.body.newDate;
    let newLocation = req.body.newLocation;

    let result;

    if(newDescription) result = await Event.updateOne({_id:eventId},{$set:{description:newDescription}});
    else if (newDate) result = await Event.updateOne({_id:eventId},{$set:{eventDate:newDate}});
    else if (newLocation) result = await Event.updateOne({_id:eventId},{$set:{location:newLocation}});

    if(result.n==0) {
        return res.status(404).send({message:'User not found'});
    } else {
        if(result.nModified==0) {
            return res.status(304).send({message:'Not modified'});
        } else {
            return res.status(200).send({message:'Updated successfully'})
        }
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

exports.getEvent = async function (req, res, next) {
    let eventId = req.params.eventId;

    let event = await Event.findOne({_id:eventId}).populate('members', '_id name', null).populate('owner', '_id name', null);

    if(!event){
        return res.status(404).send({message: 'Event not found'});
    } else {
        return res.status(200).send({event:event});
    }
};

exports.join = async function (req, res, next) {
    let eventId = req.body.eventId;
    let userId = req.body.userId;

    let event = await Event.updateOne({_id:eventId},{$addToSet:{members:userId}});

    if(event.n==0){
        return res.status(404).send({message: 'Event not found'});
    } else {
        if(event.nModified==0){
            return res.status(304).send({message: 'User already in'});
        } else {
            return res.status(200).send({message: 'Joined successfully'});
        }
    }
};

exports.leave = async function (req, res, next) {
    let eventId = req.body.eventId;
    let userId = req.body.userId;

    let event = await Event.updateOne({_id:eventId},{$pull:{members:userId}});

    if(event.n==0){
        return res.status(404).send({message: 'Event not found'});
    } else {
        if(event.nModified==0){
            return res.status(304).send({message: 'User not joined'});
        } else {
            return res.status(200).send({message: 'Leaved successfully'});
        }
    }
};

