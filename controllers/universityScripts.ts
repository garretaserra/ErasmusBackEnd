'use strict';
import {Request, Response} from  'express';
let University = require('../models/university');

exports.getAll = async function(req, res, next) {
    let universities = await University.find();
    return res.status(200).send({universities:universities});
};
