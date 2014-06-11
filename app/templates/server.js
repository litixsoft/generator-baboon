'use strict';

var express = require('express');
var rootPath = __dirname;

var baboon = require('baboon')(rootPath);
var routes = require('./server/routes')(baboon);


// Express
var app = express();

// Express configuration
require('baboon/lib/config/express')(app, routes, baboon);

// Express server
var server = baboon.appListen(app);

// Socket.Io server
var io = require('socket.io').listen(server);

// Socket.Io configuration
require('baboon/lib/config/socket-io')(io, baboon);

// Expose app
var exports;
exports = module.exports = app;