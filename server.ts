//Import libraries
import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');
import cors = require('cors');
import errorHandler = require('errorhandler');
import session = require('express-session');

//Import config
import config = require('./config/passport');

//Import routes
let testRouter = require('./routes/test');
let userRouter = require('./routes/api/user');

//Server variable initialization
let server = express();
server.use(cors());
server.use(bodyParser());
server.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
server.use(errorHandler());

server.use('/test', testRouter);
server.use('/user', userRouter);


//Make server listen on port 3000
server.listen(3000);
console.log('Server listening on port 3000');
module.exports = server;

//Mongo database connection
mongoose.connect("mongodb://localhost:27017/erasmus",{
    useNewUrlParser: true,
    reconnectTries : Number.MAX_VALUE,
    autoReconnect : true,
    useUnifiedTopology: true,
    reconnectInterval: 500
}).then(() =>{
    console.log('Connection to the database successful');
}).catch(err =>{
    console.log(`Database error: ${err.message}`);
});

//Handle database connection events
mongoose.connection.on('reconnected', () => {
    console.log('Database reconnected');
});
mongoose.connection.on('error', (err: any) => {
    console.log(`Database error: ${err.message}`);
});
mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
    //If database is disconnected it wil try again
    mongoose.connect("mongodb://localhost:27017/erasmus",{
        useNewUrlParser: true,
        reconnectTries : Number.MAX_VALUE,
        autoReconnect : true,
        useUnifiedTopology: true,
        reconnectInterval: 500
    });
    //hsabfiyahgf
});
