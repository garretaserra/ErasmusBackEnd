export {};
let mongoose = require('mongoose');
let Post = require('./base');

let Event = Post.discriminator('Event', new mongoose.Schema({
        eventDate: { type: Date, default: Date.now()},
        location: { type: String, required: true },
        members: { type: mongoose.Schema.ObjectId , ref: 'User', unique: false }
    }),
);

module.exports = mongoose.model('Event');
