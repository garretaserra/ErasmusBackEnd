import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import router from './routes/index';
import {Socket} from "socket.io";

const port: number = 3000;
const app: express.Application = express();
const server = app.listen(port);
const io = require('socket.io').listen(server);


let MONGO_URI : string = '';

let env = process.argv[2];
if(env == 'local') {
    console.log("Despliegue local");
    MONGO_URI = 'mongodb://localhost:27017/erasmus';
}
else {
    console.log("Despliegue en producción");
    MONGO_URI = 'mongodb://mongo:27017/erasmus';
}




app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET')
    }
    next()
});

app.use( express.json() );
app.use( '', router );
app.use( bodyParser.json() );
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup('swagger.json'));

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    reconnectTries : Number.MAX_VALUE,
    autoReconnect : true,
    useUnifiedTopology: true,
    reconnectInterval: 500
}).then(() => {
    console.log('Connected to DB');
}).catch(error => {
    console.error('Connection to DB Failed');
    console.error(error.message);
    process.exit(-1);
});

mongoose.connection.on('reconnected', () => {
    console.log('Database reconnected');
});
mongoose.connection.on('error', (err: any) => {
    console.log(`Database error: ${err.message}`);
});
mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
});

app.listen(port, function () {
    if(env == 'local') {
        console.log('Listening on http://localhost:' + port);
    }
    else {
        console.log('Listening on http://147.83.7.156:' + port);
    }
});

//Socket IO
let userList = {};
io.on('connection', onConnection);

function onConnection(socket) {

    console.log('a user connected');

    let username: string = socket.handshake.query.name;
    userList[username] = socket.id;

    console.log(username + ": " + userList[username]);

    socket.on('message', function (data) {
        console.log(data.message + " by " + username + " to " + data.destination);
        if (userList[data.destination] == null) {
            console.log('user not online');
            //TODO: store msg database
        } else {
            io.to(userList[data.destination]).emit('message', data);
        }
    });

    socket.on('disconnect', function() {
        console.log(username + ' disconnected');
        userList[username] = null;
    });
}

