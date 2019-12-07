let mongoose = require('mongoose');

import {Schema,model} from 'mongoose'

const PostSchema: Schema = new Schema({
    owner: { type: String, required: true},
    type: { type: String, required: true },
    message: { type: String, required: true }
});

export default model('Post', PostSchema);
