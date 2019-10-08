//Import libraries
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let swaggerUi = require('swagger-ui-express');
let swaggerDocument = require('./swagger.json');

//Import routes
let testRouter = require('./routes/test');
let userRouter = require('./routes/user');

//Server variable initialization
let server = express();

server.use(bodyParser());

server.use('/test', testRouter);
server.use('/user', userRouter);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
});
