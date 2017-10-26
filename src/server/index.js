/* Copyright W. Ju, @2017 */
'use strict';

let path            = require('path'),
    express         = require('express'),
    bodyParser      = require('body-parser'),
    session         = require('express-session'),
    RedisStore      = require('connect-redis')(session),
    redis           = require('redis'),
    logger          = require('morgan'),
    mongoose        = require('mongoose');

const redisPort = 32773;

// Setup the Express Pipeline
let app = express();
let staticPath = path.join(__dirname, '../../public');
app.use(express.static(staticPath));
app.use(logger('dev'));
// Setup pipeline support for server-side templates
app.engine('pug', require('pug').__express);
app.set('views', __dirname);
app.use(bodyParser.json({ limit: '50mb', parameterLimit: 1000000 }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
// Setup pipeline session support
let expSession = session({
    /*
    store: new RedisStore({
        host: 'localhost',
        port: redisPort
    }),
    */
    name: 'session',
    secret: 'ohhellyes',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false
    }
});
app.use(expSession);

// Connect to mongoBD
let options = { promiseLibrary: require('bluebird') };
mongoose.connect('mongodb://192.168.99.100:32768/mturk', options, err => {
    if (err) console.log(err);
    else console.log('\t MongoDB connected');
});

// Import our Data Models
app.models = {
    Condition: require('./models/condition'),
    Response: require('./models/response'),
};

// Import our API Routes
require('./api/v1/response')(app);
require('./api/v1/condition')(app);
require('./api/v1/session')(app);

/**********************************************************************************************************/

// Give them the SPA base page
app.get('*', (req, res) => {
    res.render('base.pug', {});
});

/*****************************************************************************************************/

// Establish connection to Redis
/*
let redisClient = redis.createClient(redisPort, 'localhost');
redisClient.on('ready', () => {
    console.log('\tRedis Connected.');
}).on('error', () => {
    console.log('Not able to connect to Redis.');
    process.exit(-1);
});
*/

// Add WebSocket Support
let http = require('http').Server(app);
let sharedsession = require("express-socket.io-session");
let io = require('socket.io')(http);
io.use(sharedsession(expSession));

io.on('connection', socket => {
    socket.on('WORKER:CONNECT', (data) => {
        console.log(`Worker connect: ${data["worker_id"]}`);
        socket.on('disconnect', () => {
            console.log(`Worker disconnect: ${data["worker_id"]}`);
        });
    });

    /*
    socket.on('USERNAME:REQUEST', msg => {
        // Make sure we have latest session data
        socket.handshake.session.reload(() => {
            const currentUsername = socket.handshake.session.username;
            // Is it available
            User.request(msg.username, currentUsername, err => {
                if (err) socket.emit('USERNAME:ERROR', err);
                else {
                    // Broadcast LEAVE if swapping username
                    io.emit('USER:LEAVE', { username: currentUsername });
                    socket.handshake.session.username = msg.username;
                    socket.handshake.session.save();
                    // Sent an ACCEPT (to just socket) and a JOIN (to everyone)
                    socket.emit('USERNAME:ACCEPT');
                    io.emit('USER:JOIN', { username: msg.username });
                }
            });
        });
    });

    socket.on('USERS:REQUEST', () => {
        User.list((err, users) => {
            socket.emit('USERS:RECEIVE', users);
        });
    });

    socket.on('COMMENTS:REQUEST', () => {
        Comment.list((err, comments) => {
            socket.emit('COMMENTS:RECEIVE', comments);
        });
    });

    // User sends message
    socket.on('COMMENT:POST', msg => {
        // Make sure we have latest session data
        socket.handshake.session.reload(() => {
            const username = socket.handshake.session.username;
            // Only allow users that have set username
            if (!username) return;
            // Post the comment
            const text = msg.text ? msg.text : '';
            Comment.post(username, text, (err, comment) => {
                io.emit('COMMENT:RECEIVE', comment);
            });
        });
    });
    */
});

/*****************************************************************************************************/

http.listen(8080, () => {
    console.log('Example app listening on 8080');
});