export {};
let mongoose = require('mongoose');

let baseOptions = {
    discriminatorKey: 'type', // our discriminator key, could be anything
    collection: 'posts', // the name of our collection
};

let Base = mongoose.model('Base', new mongoose.Schema({
        owner: { type: mongoose.Schema.ObjectId, ref: 'User' ,required: true},
        type: { type: String, required: true },
        modificationDate: { type: Date }
        }, baseOptions,
    ),
);

module.exports = mongoose.model('Base');
