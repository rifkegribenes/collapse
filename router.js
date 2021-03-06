const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'localhost:3000';

const StockController = require('./app/controllers/stock.ctrl');

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
  stockRoutes.get('/allstocks', StockController.getAllStocks);

  // Add a stack
  // Returns fail status + message -or- success status
  stockRoutes.put('/add/:stock/', StockController.addStock);

  // Remove a stack
  // Returns fail status + message -or- success status
  stockRoutes.put('/remove/:stock/', StockController.removeStock);


  // Set url for API group routes
  app.use('/api', apiRoutes);

};
