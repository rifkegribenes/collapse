'use strict';

// set up ======================================================================
const express = require('express');
const app = express();
const middleware = require('./middleware');
app.use(middleware);
const favicon = require('serve-favicon');
const dotenv = require('dotenv').load();
const path = require('path');

// connect to db
const mongoose = require('mongoose');
const configDB = require('./app/config/database.js');
mongoose.connect(configDB.url, configDB.options);
mongoose.Promise = global.Promise;

// import routes
const router = require('./router');
router(app);

// set static path
app.use(express.static(path.join(__dirname, '/client/build/')));

app.get('/', (req, res) => {
  console.log('root route, serving client');
  res.status(200)
    .sendFile(path.join(__dirname, '../client/build/index.html'));
});

// launch server
const http = require('http');
const port = process.env.PORT || 3001;
const server = http.createServer(app).listen(port, () => {
  console.log('Node.js listening on port ' + port + '...');
});

// configure socket
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('action', () => {
    socket.broadcast.emit('action', {type:'getallStocks'});
		});
	socket.on('disconnect', () => {
		console.log(`Socket disconnected: ${socket.id}`)
	});
});
