import {Schema, model} from 'mongoose';

const NotificationSchema: Schema = new Schema({
    author: { type: String, required: true },
    destination: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, required: true },
    goToUrl: { type: String },
    timestamp: {type: Date, required: true}
});

export default model('Notification', NotificationSchema);
