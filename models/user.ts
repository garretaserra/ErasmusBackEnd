import {Schema, model} from 'mongoose';

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: String,
    follows: [],
    following: [],
    events: []
});

export default model('User', UserSchema);
