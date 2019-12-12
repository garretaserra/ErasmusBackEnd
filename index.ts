import express from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import router from './routes/index';

let swaggerDocument = require('./swagger');
let mongoose = require('mongoose');
require('./models/user');
require('./models/post');

const port: number = 3000;
const app: express.Application = express();
const server = app.listen(port, eventListener);
const io = require('socket.io').listen(server);


let MONGO_URI : string = '';

let env = process.argv[2];
if(env == 'local') {
    console.log("Despliegue local");
    MONGO_URI = 'mongodb://root:root@localhost:27017/erasmus';
}
else {
    console.log("Despliegue en producción");
    MONGO_URI = 'mongodb://root:root@mongo:27017/erasmus';
}


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

function eventListener() {
    if(env == 'local') {
        console.log('Listening on http://localhost:' + port);
    }
    else {
        console.log('Listening on http://147.83.7.156:' + port);
    }
}

/* Socket IO */

//Let us define a hashMap being the key the username and the values its socketId
let userList: Map<string, string> = new Map();

//Event listener when a socket is connected
io.on('connection', onConnection);

function onConnection(socket) {

    console.log('a user connected');

    //Once connected, the socket is attached with a query param email
    let email: string = socket.handshake.query.email;
    //We store it in the hashMap with the corresponding socketId
    userList.set(email, socket.id);

    console.log(userList);

    io.emit('userList', Array.from(userList));

    //Private message user-to-user if both are online, otherwise store it
    socket.on('message', function (data) {
        console.log(data.message + " by " + email + " to " + data.destination);
        if (userList.get(data.destination)) {
            console.log('user not online');
            //TODO: store msg database
        } else {
            io.to(<string>userList.get(data.destination)).emit('message', data);
        }
    });

    //On a disconnection, delete its socketId from the hashMap
    socket.on('disconnect', function() {
        console.log(email + ' disconnected');
        userList.delete(email);
        io.emit('userList', Array.from(userList));
    });
}

