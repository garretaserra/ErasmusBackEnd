export {};
let mongoose = require('mongoose');
let Post = require('./base');

let Event = Post.discriminator('Event', new mongoose.Schema({
        description: { type: String, required: true },
        eventDate: { type: Date },
        location: { type: String, required: true },
        members: [{ type: mongoose.Schema.ObjectId , ref: 'User', unique: false }]
    }),
);

module.exports = mongoose.model('Event');
