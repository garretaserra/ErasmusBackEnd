'use strict';

let mongoose = require('mongoose');

let test = mongoose.Schema({
    testName: String
});

module.exports = mongoose.model('Test', test);
