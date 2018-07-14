const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StockSchema = new mongoose.Schema({
  name: String,
  code: String
});

module.exports = mongoose.model('Stock', StockSchema);