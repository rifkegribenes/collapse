'use strict';

// set up ======================================================================
var express = require('express');
var app = express();
const path = require('path');
require('dotenv').load();
const favicon = require('serve-favicon');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var https = require('https');
var configDB = require('./app/config/database.js');


// configuration ===============================================================
mongoose.connect(configDB.url, configDB.options); // connect to db
mongoose.Promise = global.Promise;

// Basic middleware for all Express requests
app.use(favicon(path.join(__dirname, '/client/public/favicon.ico'))); // serve favicon
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(morgan('dev')); // Log requests to API using morgan


// Enable CORS from client side
app.use(cors());

// set static path
app.use(express.static(path.join(__dirname, '/client/build/')));

app.get('/', (req, res) => {
  console.log('root route, serving client');
  res.status(200)
    .sendFile(path.join(__dirname, '../client/build/index.html'));
});

// routes ======================================================================
const router = require('./router');
router(app);

// launch ======================================================================
var port = process.env.PORT || 3001;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
