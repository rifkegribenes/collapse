const Stock = require('../models/stock.model');
const merge = require('lodash.merge');
const https = require('https');


const handleError = (res, statusCode) => {
  const status = statusCode || 500;
  return (err) => {
    res.status(status).send(err);
  };
}

const handleResponse = (res, statusCode) => {
  const status = statusCode || 200;
  return (entity) => {
    if (entity) {
      res.status(status).json(entity);
    }
  };
}

const handleNotFound = (res) => {
  return (entity) => {
    if (!entity) {
      return res.status(400).json({ message: 'Stock not found.' });
    }
    return entity;
  };
}

const updateDB = (updates) => {
  return (entity) => {
    const updated = merge(entity, updates);
    return updated.save()
      .spread(updated => {
        return updated;
      });
  };
}

const removeEntity = (res) => {
  return (entity) => {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

// get all stocks
exports.getAllStocks = (req, res) => {
  Stock.find()
    .then((stocks) => {
      // console.log(`stock.ctrl.js > 55`);
      // console.log(stocks);
      let stockDataArrayPromise = stocks.map((stock) => {
        return getStockData(stock.code)
          .then((stockDataRecord) => {
            console.log('stock.ctrl.js > 59');
            // console.log(stockDataRecord);
            return {
              _id: stock._id,
              name: stock.name,
              code: stock.code,
              data: [ ...stockDataRecord ]
            };
          })
          .catch(err => console.log(`stock.ctrl.js > 70: ${err}`));
        });

      Promise.all(stockDataArrayPromise)
        .then((stockDataArray) => {
          console.log(`stock.ctrl.js > 67`);
          // console.log(stockDataArray);
          // res.data = stockDataArray;
          // handleResponse(res);
          res.status(200).json(stockDataArray);
        })
        .catch(err => console.log(`stock.ctrl.js > 80: ${err}`));


    })
    .catch(handleError(res));
}

const getStockData = (stock) => {
  return new Promise((resolve, reject) => {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = now.getMonth() + 1;
    const DD = now.getDate();

    https.get(`https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?api_key=${process.env.QUANDL_API_KEY}&start_date=${YYYY - 1}-${MM}-${DD}&end_date=${YYYY}-${MM}-${DD}`, res => {
        let data = '';
        res.on('data', (chunk)=> {
          data += chunk;
        });


      res.on('end', () => {
        data = JSON.parse(data);

        if (!data || data.quandl_error) {
          reject(data);
        } else {
          console.log('stock.ctrl.js > 96');
          // console.log(data.dataset.data);
          // return data;
          resolve(data.dataset.data);
        }

      });

      // res.resume();
    }).on('error', e => {
      reject(Error(e.message));
    })
  });
}

// get one stock
exports.getOneStock = (req, res) => {
  getStockData(req.params.stock)
    .then(handleResponse(res))
    .catch(handleError(res, 400));
  }

// add stock to mongo
exports.addStock = (req, res) => {

  if (!req.params.stock) {
    return res.status(400).json({ message: 'Stock not found.' });
  }
  // look for stock in DB
  Stock.find({ name: req.params.stock })
    .then((stock) => {

      // if stock already exists in mongo, return
      if (stock.length) {
        return;
      }

      // otherwise, create new record in mongo
      Stock.create({
        name: req.params.stock
      });

    })
  .catch((err) => {
    return res.status(400).json({ message: err });
  });
}

// update stock
exports.updateStock = (req, res) => {
  if (req.body._id) {
    delete req.body._id;
  }
  Stock.findById(req.params.id)
    .then(handleNotFound(res))
    .then(updateDB(req.body))
    .then(handleResponse(res))
    .catch(handleError(res));
}

// delete stock
exports.removeStock = (req, res) => {
  Stock.findById(req.params.stock)
    .then(handleNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
