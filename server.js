'use strict';

// set up ======================================================================
var express = require('express');
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('dotenv').load();
const favicon = require('serve-favicon');
const middleware = require('./middleware');
var mongoose = require('mongoose');
var https = require('https');
var configDB = require('./app/config/database.js');

app.use(middleware);

mongoose.connect(configDB.url, configDB.options); // connect to db
mongoose.Promise = global.Promise;

// routes ======================================================================
const router = require('./router');
router(app);

// io.on('connection', function(socket) {
// 	console.log('New client connected');
// 	socket.emit('stocks', { stocks: ['GOOGL', 'APPL'] });
// 	socket.on('my other event', function(data) {
// 		console.log(data);
// 	});
// 	socket.on('disconnect', function() {
// 		console.log('Client disconnected');
// 	});
// });

// launch ======================================================================
var port = process.env.PORT || 3001;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
