let mongoose = require('mongoose');

import {Schema} from 'mongoose'

const PostSchema: Schema = new Schema({
    type: { type: String, required: true },
    message: { type: String, required: true }
});

module.exports = mongoose.model('Post', PostSchema);
