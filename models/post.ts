let mongoose = require('mongoose');

import {Schema,model} from 'mongoose'

const PostSchema: Schema = new Schema({
    type: { type: String, required: true },
    message: { type: String, required: true }
});

export default model('Post', PostSchema);
