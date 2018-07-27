const Stock = require('../models/stock.model');
const merge = require('lodash.merge');
const https = require('https');

const handleError = (res, statusCode) => {
  const status = statusCode || 500;
  return (err) => {
    console.log('8');
    console.log(err);
    res.status(status).send(err);
  };
}

const handleResponse = (res, statusCode) => {
      console.log('15');
  const status = statusCode || 200;
  return (entity) => {
    console.log('17');
    console.log(entity);
    if (entity) {
      console.log('20');
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

const removeEntity = (req, res, next) => {
  console.log('42');
  return (entity) => {
    if (entity) {
      return entity.remove()
        .then(() => {
          console.log('47');
          next();
        });
    }
  };
}

// get all stocks
exports.getAllStocks = (req, res) => {
  console.log('60');
  Stock.find()
    .then(() => {
      console.log('63');
      handleResponse(res);
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
exports.addStock = (req, res, next) => {
  console.log('110');
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
      console.log('124');

      // res
      //   .status(res2.statusCode)
      //   .end();

      if (parseInt(res2.statusCode / 100) === 2) {
        const code = data.dataset.dataset_code;
        console.log('133');
        // look for stock in DB by code
        Stock.find({ code })
          .then((stock) => {
            console.log('1373');
            // if stock already exists in DB, return
            if (stock.length) {
                console.log('140');
              return next(req, res2);
            }

            // otherwise, create new record in mongo
            Stock.create({
              name: data.dataset.name,
              code: data.dataset.dataset_code
            }).then(() => {
              console.log('149');
              next(req, res2);
            });


          });
      } else {
        console.log('155');
        console.log(`status: ${res2.statusCode}`);
        handleError(res2);
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
exports.removeStock = (req, res, next) => {
  Stock.findById(req.params.stock)
    .then(handleNotFound(res))
    .then(removeEntity(req, res, next))
    .catch((err) => {
      console.log(err)
      handleError(res)
    });
}