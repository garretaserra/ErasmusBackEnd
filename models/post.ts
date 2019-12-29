export {};
let mongoose = require('mongoose');
let Base = require('./base');

let Post = Base.discriminator('Post', new mongoose.Schema({
        message: { type: String, required: true },
        comments: [{
            owner: { type: mongoose.Schema.ObjectId, ref: 'User' ,required: true},
            message: String
        }]
    }),
);

module.exports = mongoose.model('Post');
