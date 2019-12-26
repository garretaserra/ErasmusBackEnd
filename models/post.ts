export {};
let mongoose = require('mongoose');
let Base = require('./base');

let Post = Base.discriminator('Post', new mongoose.Schema({
        comments: [{
            owner: String,
            comment: String
        }]
    }),
);

module.exports = mongoose.model('Post');
