let mongoose = require('mongoose');

import {Schema, model} from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    hash: { type: String },
    salt: { type: String },
    profilePhoto: String ,
    followers: [{ type: Schema.ObjectId, ref: 'User', unique: false }], //Gente que me sigue a mí
    following: [{ type: Schema.ObjectId, ref: 'User', unique: false }], //Gente a la que yo sigo
    age: { type: Number },
    course: { type: Number },
    homeUniversity: { type: String },
    destUniversity: {  type: String },
    languages:[{
        name: String
    }],
    notifications:[{type: Schema.ObjectId, ref: 'Notification', unique: false}]
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    const minutes = 60;
    expirationDate.setTime(today.getTime() + minutes*60000);
    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: expirationDate.getTime() / 1000,
    }, 'secret');
};

UserSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        name: this.name,
        email: this.email
    };
};

export default model('User', UserSchema);
