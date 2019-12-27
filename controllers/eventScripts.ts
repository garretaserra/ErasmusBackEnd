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
        event.members.push(event.owner_id);
        event.save();
        return res.status(200).send({post:event});
    }
};

exports.modifyEvent = async function(req, res, next) {
    let event = req.body.event;
    event = await Event.updateOne(event);
    if(event.n==0){
        return res.status(404).send({message: 'Event not found'});
    } else {
        if(event.nModified==0){
            return res.status(304).send({message: 'Not modified'});
        } else {
            return res.status(200).send({message: 'Modified successfully'});
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
    let event = await Event.findOne({_id:eventId});
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

