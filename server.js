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

mongoose.connect(configDB.url, configDB.options); // connect to db
mongoose.Promise = global.Promise;

// routes ======================================================================
const router = require('./router');
router(app);

// server.listen(0, () => {
// 	console.log('Node.js listening on port ' + server.address().port + '...');
// });
//

const port = process.env.PORT || 3001;

const server = http.createServer(app).listen(port, () => {
  console.log('Node.js listening on port ' + port + '...');
});

const getContent = (url) => {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? https : http;
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
    })
};

// const StockController = require('./app/controllers/stock.ctrl');

// const io = socket.listen(server);
var io = require('socket.io')(server);
const Stock = require('./app/models/stock.model');

io.on('connection', (socket) => {
  console.log("Socket connected: " + socket.id);
  let stockCode;
  socket.on('action', (action) => {
    if (action.type === 'server/addStock') {
    	 console.log(`server.js > 41`);
    	 console.log(action);
    	 stockCode = action.data;
			  if (!action.data) {
			    console.log(`stock.ctrl.js > 135`);
			    stockCode = action.payload.data;
			  }
			 console.log(`server.js > 73: ${stockCode}`);
			 getContent(`https://www.quandl.com/api/v3/datasets/WIKI/${stockCode.toUpperCase()}/metadata.json`)
			 		.then((data) => {
			 				console.log(`server.js > 76`);
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
			              console.log(`stock.ctrl.js > 90`);
			              console.log(`Stock ${code} already in chart`);
			              socket.broadcast.emit('action', {type:'getallStocks'});
			            	console.log(`server.js > 93`);
			            	return;
			            }

			            // otherwise, create new record in mongo
			            Stock.create({
			              name: data.dataset.name,
			              code: data.dataset.dataset_code
			            })
			            .then(() => {
			            	socket.broadcast.emit('action', {type:'getallStocks'});
			            	console.log(`server.js > 83`);
			            })
			            .catch(err => console.log(`server.js > 85 ${err}`));

			          })
			          .catch(err => console.log(`server.js > 97 ${err}`));
			    })
			    .catch(err => {
			    	console.log(`server.js > 99 ${err}`)
			    });
			} else if (action.type === 'server/removeStock') {
				console.log(`removeStock`);
				console.log(action);
				stockCode = action.data;
			  if (!action.data) {
			    console.log(`stock.ctrl.js > 113`);
			    stockCode = action.payload.data;
			  }
    		const code = stockCode.toUpperCase();
				Stock.remove({ code })
				.then(() => {
					console.log(`Removed stock ${code}!`);

					socket.broadcast.emit('action', {type:'getallStocks'});
				})
				.catch((err) => console.log(`server.js > 126 ${err}`));
			}
		});
	socket.on('disconnect', function() {
		console.log("Client disconnected: " + socket.id);
	});
});

// launch ======================================================================
// var port = process.env.PORT || 3001;
// server.listen(port,  function () {
// 	console.log('Node.js listening on port ' + port + '...');
// });
