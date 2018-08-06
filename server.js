'use strict';

// set up ======================================================================
const express = require('express');
const app = express();
const middleware = require('./middleware');
app.use(middleware);
const http = require('http');
require('dotenv').load();
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const https = require('https');
const configDB = require('./app/config/database.js');
const socket = require('socket.io');
const StockController = require('./app/controllers/stock.ctrl');

mongoose.connect(configDB.url, configDB.options); // connect to db
mongoose.Promise = global.Promise;

// routes ======================================================================
const router = require('./router');
router(app);

const port = process.env.PORT || 3001;

const server = http.createServer(app).listen(port, () => {
  console.log('Node.js listening on port ' + port + '...');
});

const io = require('socket.io')(server);
const Stock = require('./app/models/stock.model');
const utils = require('./app/utils');

io.on('connection', (socket) => {
  console.log("Socket connected: " + socket.id);
  let stockCode;
  socket.on('action', (action) => {
    if (action.type === 'server/addStock') {
    	 console.log(`server.js > 39`);
    	 console.log(action);
    	 stockCode = action.data;
			  if (!action.data) {
			    console.log(`server.js > 43`);
			    stockCode = action.payload.data;
			  }
			 console.log(`server.js > 46: ${stockCode}`);
			 utils.getContent(`https://www.quandl.com/api/v3/datasets/WIKI/${stockCode.toUpperCase()}/metadata.json`)
			 		.then((data) => {
			 				console.log(`server.js > 49`);
			 				let code = stockCode.toUpperCase();
			 				if (data.dataset) {
			 					code = data.dataset.dataset_code;
			 				}
			 				console.log(code);

			        // look for stock in DB by code
			        Stock.find({ code })
			          .then((stock) => {

			            // if stock already exists in DB, return
			            if (stock.length) {
			              console.log(`server.js > 62`);
			              console.log(`Stock ${code} already in chart`);
			              socket.broadcast.emit('action', {type:'getallStocks'});
			            	console.log(`server.js > 65`);
			            	return;
			            }

			            // otherwise, create new record in mongo
			            Stock.create({
			              name: data.dataset.name,
			              code: data.dataset.dataset_code
			            })
			            .then(() => {
			            	socket.broadcast.emit('action', {type:'getallStocks'});
			            	console.log(`server.js > 76`);
			            })
			            .catch(err => console.log(`server.js > 78 ${err}`));

			          })
			          .catch(err => console.log(`server.js > 81 ${err}`));
			    })
			    .catch(err => {
			    	console.log(`server.js > 84 ${err}`)
			    });
			} else if (action.type === 'server/removeStock') {
				console.log(`removeStock`);
				console.log(action);
				stockCode = action.data;
			  if (!action.data) {
			    console.log(`server.js > 91`);
			    stockCode = action.payload.data;
			  }
    		const code = stockCode.toUpperCase();
				Stock.remove({ code })
				.then(() => {
					console.log(`Removed stock ${code}!`);

					socket.broadcast.emit('action', {type:'getallStocks'});
				})
				.catch((err) => console.log(`server.js > 101 ${err}`));
			}
		});
	socket.on('disconnect', function() {
		console.log("Client disconnected: " + socket.id);
	});
});
