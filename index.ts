import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import router from './routes/index';

const port: number = 3000;
const MONGO_URI: string = 'mongodb://localhost:27017/erasmus';
const app: express.Application = express();
const server = app.listen(port);
const io = require('socket.io').listen(server);

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

io.on('connection', function(socket){
    console.log('a user connected');
});
