export {};
let mongoose = require('mongoose');

let University = mongoose.model('University', new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        country: { type: String, required: true }
    })
);

module.exports = mongoose.model('University');
