import {Schema, model} from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String},
    hash: { type: String},
    salt: { type: String},
    password: {type: String},
    profilePhoto: String,
    followers: [],//Gente que me sigue a mí
    following: [],//Gente a la que yo sigo
    posts: []
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
        email: this.email,
        token: this.generateJWT(),
    };
};

export default model('User', UserSchema);
