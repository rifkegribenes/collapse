const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const middleware = [
  morgan('tiny'),
  cors(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  express.static(path.join(__dirname, '../../client/build')),
]

module.exports = middleware