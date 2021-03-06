const express = require('express');
const fs = require('fs');
const { join } = require('path');
const passport = require('passport');
const logger = require('mean-logger');
const io = require('socket.io');

const auth = require('./config/middlewares/authorization');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();

/**
 * Main application entry file.```
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = require('./config/config');

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models

const modelsPath = join(__dirname, '/app/models');

const walk = function (path) {
  return fs.readdirSync(path).forEach((file) => {
    const newPath = `${path}/${file}`;
    const stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};

walk(modelsPath);

// express settings
require('./config/express')(app, passport, mongoose);
require('./config/passport')(passport);
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
const server = app.listen(config.port);
const ioObj = io.listen(server, { log: false });

// game logic handled here

require('./config/socket/socket')(ioObj);

console.log(`Express app started on port ${config.port}`);

// Initializing logger

logger.init(app, passport, mongoose);

// expose app

module.exports = app;
