const path = require('path');
const http = require('http');
const express = require('express');

const app = express();
const server = http.Server(app);
const socketio = require('socket.io');
// Init Router
const favicon = require('express-favicon');
const chalk = require('chalk');
const schedule = require('node-schedule');
const middlewares = require('./middleware');
const routes = require('./routes');
const env = require('./config/env');
const connect = require('./config/database');
const realTimeService = require('./services/realtimeService');
const projectService = require('./services/projectService');

const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

// Initialize all middlewares here
middlewares.init(app);

// Routes initialization
routes(app);

const buildPath = path.join(__dirname, '../', 'public');
app.use(favicon(path.join(buildPath, 'favicon.ico')));
app.use(express.static(buildPath));

// API Health check
app.all('/api/health-check', (req, res) => {
  return res.status(200).json({ status: 200, message: `Working Fine - ENV: ${String(env.NODE_ENV)}` });
});
// Invalid Route
app.all('/api/*', (req, res) => {
  return res.status(400).json({ status: 400, message: 'Bad Request' });
});

// Invalid Route
app.all('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
  // return res.status(400).json({ status: 400, message: 'Bad Request' });
});

// start the server & connect to Mongo
connect(env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/iscribblers')
  .then(() => {
    console.log('%s database connected', chalk.green('✓'));
  })
  .catch((e) => {
    console.log('error connecting', e);
    if (e.name === 'MongoParseError') {
      console.error(`\n\n${e.name}: Please set NODE_ENV to "production", "development", or "staging".\n\n`);
    } else if (e.name === 'MongoNetworkError') {
      console.error(`\n\n${e.name}: Please start MongoDB\n\n`);
    } else {
      console.log(e);
    }
  });

/**
 * Start Express server.
 */
server.listen(process.env.PORT || 3000, () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    process.env.PORT,
    process.env.NODE_ENV,
  );
  console.log('  Press CTRL-C to stop\n');
});

io.on('connection', (socket) => {
  console.log('%s New user connected', chalk.green('✓'));
  realTimeService.setSocket(io, socket);
});

schedule.scheduleJob('*/60 * * * *', async function () {
  try {
    await projectService.autoUpdateStatus();
  } catch (e) {
    throw e;
  }
});
