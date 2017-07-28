// Util functions for interacting with the Grid+ hub API
var Promise = require('bluebird').Promise;
var config = require('../../../config.js');
var https = require('https');

let BASE = config.api.base_url;
let PORT = config.api.port;
exports.get = get;
exports.post = post;

// For Buffer node module
import '../../../shim.js'

/**
 * Make a get request to the API. Returns the body of the response.
 *
 * @param  {String} url     description
 * @param  {Object} headers (optional)
 */
function get(url, headers) {
  return new Promise((resolve, reject) => {
    var options = {
      host: BASE,
      port: PORT,
      path: url,
      method: 'GET',
    };
    if (headers) { options.headers = headers; }
    console.log('request', options)
    request(options)
    .then((body) => { resolve(body); })
    .catch((err) => { reject(err); })
  })
}

/**
 * Make a post request to the API
 *
 * @param  {String} url     description
 * @param  {Object} body    description
 * @param  {Object} headers (optional)
 */

function post(url, headers, data) {
  return new Promise((resolve, reject) => {
    var options = {
      host: BASE,
      port: PORT,
      path: url,
      method: 'POST',
      headers: headers
    };

    request(options, data)
    .then((body) => { resolve(body); })
    .catch((err) => { reject(err); })
  })
}

// Make any kind of http request given params and, optionally, POST data
function request(options, data) {
  return new Promise((resolve, reject) => {

    var req = https.request(options, function(res) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      var body = [];
      res.on('data', function(chunk) { body.push(chunk); });

      res.on('end', function() {
        console.log('body?', Buffer.concat(body).toString())
        try { body = JSON.parse(Buffer.concat(body).toString()); }
        catch(e) { reject(e); }
        resolve(body);
      });
    });

    // reject on request error
    req.on('error', function(err) { reject(err); });
    if (data) { req.write(data); }

    req.end();
  })
}
