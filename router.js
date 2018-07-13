const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'localhost:3000';

const StockController = require('./app/controllers/stock.ctrl');
const StaticController = require('./app/controllers/static.ctrl');

const express = require('express');
// const helpers = require('./app/utils/index');

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    stockRoutes = express.Router();

  //= ========================
  // Stock Routes
  //= ========================

  // Set stock routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/stock', stockRoutes);

  // Get all stocks
  // Returns fail status + message -or- array of all stocks
  // stockRoutes.get('/allstocks', StockController.getStocks);

  // Add a stack
  // Returns fail status + message -or- array of all stocks
  // stockRoutes.put('/add/:stockId/', StockController.addStock);

  // Remove a stack
  // Returns fail status + message -or- array of all stocks
  // stockRoutes.put('/remove/:stockId/', StockController.removeStock);


  // Set url for API group routes
  app.use('/api', apiRoutes);

  // Catch client-side routes that don't exist on the back-end.
  // Redirects to /#/redirect={route}/{optional_id}
  app.get('/:client_route/:id?', StaticController.redirectHash);

};