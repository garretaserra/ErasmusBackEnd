let mongoose = require('mongoose');

import {Schema,model} from 'mongoose'

const PostSchema: Schema = new Schema({
    owner: { type: String, required: true},
    type: { type: String, required: true },
    message: { type: String, required: true },
    eventDate: { type: Date },
    modificationDate: { type: Date, default: Date.now},
    members: { type: Schema.ObjectId, ref: 'User', unique: false },
    comments: [{
        owner: String,
        comment: String
    }]
});

export default model('Post', PostSchema);
