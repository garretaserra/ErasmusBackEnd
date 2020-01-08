import {Schema, model} from 'mongoose';

const MessageSchema: Schema = new Schema({
    author: { type: String, required: true },
    destination: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: {type: Date, required: true}
});

export default model('Message', MessageSchema);
