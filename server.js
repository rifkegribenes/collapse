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

io.on('connection', (socket) => {
  console.log("Socket connected: " + socket.id);
  socket.on('action', (action) => {
    if (action.type === 'server/addStock') {
    	console.log(`addStock`);
    	let name = action.data.toUpperCase();
      let stockItem = new Stock({ name });
			stockItem.save()
				.then(() => {
					console.log(`Added new stock ${name}!`);
					socket.broadcast.emit('action', {type:'addStock', data: name});
				})
				.catch((err) => console.log(`server.js > 33 ${err}`));
			} else if (action.type === 'server/removeStock') {
				console.log(`removeStock`);
    		let name = action.data.toUpperCase();
				Stock.remove({ name })
				.then(() => {
					console.log(`Removed stock ${name}!`);
					socket.broadcast.emit('action', {type:'removeStock', data: name});
				})
				.catch((err) => console.log(`server.js > 45 ${err}`));
			}
		});
	socket.on('disconnect', function() {
		console.log("Client disconnected: " + socket.id);
	});
});

// launch ======================================================================
var port = process.env.PORT || 3001;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
