//Import libraries
let express = require('express');
let mongoose = require('mongoose');

//Import routes
let testRouter = require('./routes/testRoutes');

//Server variable initialization
let server = express();

server.use('/test', testRouter);


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
mongoose.connection.on('error', (err) => {
    console.log(`Database error: ${err.message}`);
});
mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
    //If database is disconnected it wil try again
    mongoose.connect("mongodb://localhost:27017/ftd",{
        useNewUrlParser: true,
        reconnectTries : Number.MAX_VALUE,
        autoReconnect : true,
        useUnifiedTopology: true,
        reconnectInterval: 500
    });
});
