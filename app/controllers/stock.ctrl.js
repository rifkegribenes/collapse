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
      let stockDataArrayPromise = stocks.map((stock) => {
        return getStockData(stock.code)
          .then((stockDataRecord) => {
            return {
              _id: stock._id,
              name: stock.name,
              code: stock.code,
              data: [ ...stockDataRecord ]
            };
          })
          .catch(err => console.log(`stock.ctrl.js > 62: ${err}`));
        });

      Promise.all(stockDataArrayPromise)
        .then((stockDataArray) => {
          res.status(200).json(stockDataArray);
        })
        .catch(err => console.log(`stock.ctrl.js > 69: ${err}`));

    })
    .catch((err) => {
      console.log('stock.ctrl.js > 74');
      console.log(err);
      handleError(res)
    });
}

const getStockData = (stock) => {

  return new Promise((resolve, reject) => {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = now.getMonth() + 1;
    const DD = now.getDate();

    utils.getContent(`https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?api_key=${process.env.QUANDL_API_KEY}&start_date=${YYYY - 1}-${MM}-${DD}&end_date=${YYYY}-${MM}-${DD}`)
      .then((data) => {
        resolve(data.dataset.data);
      })
      .catch((err) => {
        console.log('stock.ctrl.js > 96');
        console.log(err);
        reject(err);
      });

  });

}

// add stock to mongo
exports.addStock = (req, res) => {
  console.log(`stock.ctrl.js > 107`);

  if (!req.params.stock) {
    console.log(`stock.ctrl.js > 110`);
    return res.status(400).json({ message: 'Stock not found.' });
  }

  utils.getContent(`https://www.quandl.com/api/v3/datasets/WIKI/${req.params.stock.toUpperCase()}/metadata.json`)
    .then((data) => {
        console.log('stock.ctrl.js > 116');
        const code = data.dataset.dataset_code;
        console.log(code);

        // look for stock in DB by code
        Stock.find({ code })
          .then((stock) => {

            // if stock already exists in DB, return
            if (stock.length) {
              console.log(`stock.ctrl.js > 126`);
              return res.status(200).json({ message: `Stock ${code} already in chart` });;
            }

            // otherwise, create new record in mongo
            Stock.create({
              name: data.dataset.name,
              code: data.dataset.dataset_code
            });
            console.log(`stock.ctrl.js > 135`);
            return res.status(200).json({ message: `Added stock ${code}.` });;
          })
          .catch((err) => {
            console.log('stock.ctrl.js > 139');
            console.log(err);
            return res.status(400).json({ message: err });
          });
      })
      .catch((err) => {
        console.log('stock.ctrl.js > 145');
        console.log(err);
        return res.status(400).json({ message: err });
      });
}

// delete stock
exports.removeStock = (req, res) => {
  Stock.findById(req.params.stock)
    .then(handleNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
