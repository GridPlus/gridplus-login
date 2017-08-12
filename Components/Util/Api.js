// Util functions for interacting with the Grid+ hub API
var Promise = require('bluebird').Promise;
var config = require('../../config.js');
var https = require('https');

let BASE = config.api.base_url;
let PORT = config.api.port;
exports.get = get;
exports.post = post;

// For Buffer node module
import '../../shim.js'


// HTTP functions
//==========================================

/**
 * Make a get request to the API. Returns the body of the response.
 *
 * @param  {String} url     description
 * @param  {Object} headers (optional)
 */
function get(url, headers) {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
    };
    const endpoint = `https://${BASE}:${PORT}${url}`
    if (headers) { options.headers = headers; }

    request(endpoint, options)
    .then((body) => { console.log('body?', body); resolve(body); })
    .catch((err) => { console.log('got error', err); reject('Error connecting to server'); })
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
      // host: BASE,
      // port: PORT,
      // path: url,
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    };

    request(url, options)
    .then((body) => { resolve(body); })
    .catch((err) => { reject(err); })
  })
}

// Make any kind of http request given params and, optionally, POST data
function request(url, options) {
  return new Promise((resolve, reject) => {
    fetch(url, options || {})
    .then((res) => { return res.json() })
    .then((res_json) => {
      console.log('res_json', res_json)
      resolve(res_json);
    })
    .ctach((err) => { reject(err); })
  })
}