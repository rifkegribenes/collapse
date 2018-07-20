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
    .then(handleResponse(res))
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
          resolve(data);
        }

      });

      res.resume();
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

  https.get(`https://www.quandl.com/api/v3/datasets/WIKI/${req.params.stock.toUpperCase()}/metadata.json`, (res2) => {
    let data = '';

    res2.on('data', (chunk) => {
      data += chunk
    });

    res2.on('end', () => {
      data = JSON.parse(data);

      res
        .status(res2.statusCode)
        .end();

      if (parseInt(res2.statusCode / 100) === 2) {
        const code = data.dataset.dataset_code;

        // look for stock in DB by code
        Stock.find({ code })
          .then((stock) => {

            // if stock already exists in DB, return
            if (stock.length) {
              return;
            }

            // otherwise, create new record in mongo
            Stock.create({
              name: data.dataset.name,
              code: data.dataset.dataset_code
            });

          });
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