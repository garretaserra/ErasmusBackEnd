import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import io from 'socket.io'
import router from './routes/index';

const port: number = 3000;
const app: express.Application = express();

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

app.use(cors());
app.options('*',cors());
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
