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

io.on('connection', (socket) => {
  console.log("Socket connected: " + socket.id);
  socket.on('action', (action) => {
    if (action.type === 'server/addStock') {
    	 console.log(`server.js > 41`);
			  if (!action.data) {
			    console.log(`stock.ctrl.js > 135`);
			    return res.status(400).json({ message: 'Stock not found.' });
			  }

			 getContent(`https://www.quandl.com/api/v3/datasets/WIKI/${action.data.toUpperCase()}/metadata.json`)
			 		.then((data) => {
			 				const code = data.dataset.dataset_code;
			        console.log(`server.js > 72`);

			        // look for stock in DB by code
			        Stock.find({ code })
			          .then((stock) => {

			            // if stock already exists in DB, return
			            if (stock.length) {
			              console.log(`stock.ctrl.js > 163`);
			              return res.status(200).json({ message: `Stock ${code} already in chart` });;
			            }

			            // otherwise, create new record in mongo
			            Stock.create({
			              name: data.dataset.name,
			              code: data.dataset.dataset_code
			            })
			            .then(() => {
			            	socket.broadcast.emit('action', {type:'addStock', data: code });
			            	console.log(`server.js > 83`);
			            	return res.status(200).json({ message: `Added stock ${code}.` });
			            })
			            .catch(err => console.log(`server.js > 85 ${err}`));

			          })
			          .catch(err => console.log(`server.js > 97 ${err}`));
			    })
			    .catch(err => {
			    	console.log(`server.js > 99 ${err}`)
			    	return res.status(400).json({ message: err });
			    });
			} else if (action.type === 'server/removeStock') {
				console.log(`removeStock`);
    		const code = action.data.toUpperCase();
				Stock.remove({ code })
				.then(() => {
					console.log(`Removed stock ${name}!`);
					socket.broadcast.emit('action', {type:'removeStock', data: code });
				})
				.catch((err) => console.log(`server.js > 45 ${err}`));
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
