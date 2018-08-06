const merge = require('lodash.merge');
const http = require('http');
const https = require('https');

const Stock = require('../models/stock.model');
const utils = require('../utils');

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
      console.log(`stock.ctrl.js > 58`);
      let stockDataArrayPromise = stocks.map((stock) => {
        console.log(`stock.ctrl.js > 60: ${stock.code}`);
        return getStockData(stock.code)
          .then((stockDataRecord) => {
            // const stockDataRecord = stockDataAll.datasest.data;
            console.log(`stock.ctrl.js > 62: ${stock.code}: ${stockDataRecord.length}`);
            return {
              _id: stock._id,
              name: stock.name,
              code: stock.code,
              data: [ ...stockDataRecord ]
            };
          })
          .catch(err => console.log(`stock.ctrl.js > 69: ${err}`));
        });

      Promise.all(stockDataArrayPromise)
        .then((stockDataArray) => {
          console.log(`stock.ctrl.js > 74`);
          console.log(stockDataArray);
          res.status(200).json(stockDataArray);
        })
        .catch(err => console.log(`stock.ctrl.js > 78: ${err}`));


    })
    .catch((err) => {
      console.log('stock.ctrl.js > 85');
      console.log(err);
      handleError(res)
    });
}

const getStockData = (stock) => {

  return new Promise((resolve, reject) => {
  console.log(`stock.ctrl.js > 92`);
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = now.getMonth() + 1;
  const DD = now.getDate();

  utils.getContent(`https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?api_key=${process.env.QUANDL_API_KEY}&start_date=${YYYY - 1}-${MM}-${DD}&end_date=${YYYY}-${MM}-${DD}`)
    .then((data) => {
      console.log('stock.ctrl.js > 100');
      console.log(data.dataset.data.length);
      resolve(data.dataset.data);
    })
    .catch((err) => {
      console.log('stock.ctrl.js > 105');
      console.log(err);
      reject(err);
    });

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
  console.log(`stock.ctrl.js > 111`);

  if (!req.params.stock) {
    console.log(`stock.ctrl.js > 114`);
    return res.status(400).json({ message: 'Stock not found.' });
  }

  https.get(`https://www.quandl.com/api/v3/datasets/WIKI/${req.params.stock.toUpperCase()}/metadata.json`, (res2) => {
    let data = '';

    res2.on('data', (chunk) => {
      data += chunk
    });

    res2.on('end', () => {
      data = JSON.parse(data);

      // res
      //   .status(res2.statusCode)
      //   .end();

      if (parseInt(res2.statusCode / 100) === 2) {
        const code = data.dataset.dataset_code;
        console.log(`stock.ctrl.js > 134`);

        // look for stock in DB by code
        Stock.find({ code })
          .then((stock) => {

            // if stock already exists in DB, return
            if (stock.length) {
              console.log(`stock.ctrl.js > 142`);
              return res.status(200).json({ message: `Stock ${code} already in chart` });;
            }

            // otherwise, create new record in mongo
            Stock.create({
              name: data.dataset.name,
              code: data.dataset.dataset_code
            });
            console.log(`stock.ctrl.js > 151`);
            return res.status(200).json({ message: `Added stock ${code}.` });;

          });
      } else {
        return res
          .status(res2.statusCode)
          .end();
      }
    });
  }).on('error', (err) => {
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
