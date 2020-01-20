export {}
let mongoose = require('mongoose');

let Notification = mongoose.model('Notification', new mongoose.Schema({
        author: {type: String, required: true},
        text: {type: String, required: true},
        type: {type: String, required: true},
        goToUrl: {type: String},
    }),
);

module.exports = mongoose.model('Notification');
