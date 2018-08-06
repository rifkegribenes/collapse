const http = require('http');
const https = require('https');

exports.getContent = (url) => {
  console.log(`utils/index.js > 5`);
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? https : http;
    const request = lib.get(url, (response) => {
      console.log(`utils/index.js > 11`);
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        console.log(`utils/index.js > 14`);
         reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
       }
      // temporary data holder
      let data = "";
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => data += chunk );
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        data = JSON.parse(data);
        // console.log('utils/index.js > 24');
        // console.log(data);

        if (!data || data.quandl_error) {
          reject(data);
        } else {
          console.log('utils/index.js > 28');
          resolve(data);
        }
      });
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err));
  });
};