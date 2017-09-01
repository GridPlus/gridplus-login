// Util functions for interacting with the Grid+ hub API
var Promise = require('bluebird').Promise;
var config = require('../../config.js');
var https = require('https');
var Fs = require('./Fs.js');
var Keys = require('./Keys.js');
var sha3 = require('js-sha3').keccak256;


let BASE = config.api.base_url;
let PORT = config.api.port;
exports.get = get;
exports.post = post;
exports.checkUser = checkUser;
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
    .then((body) => { resolve(body); })
    .catch((err) => { reject('Error connecting to server'); })
  })
}

/**
 * Make a post request to the API
 *
 * @param  {String} url     description
 * @param  {Object} body    description
 * @param  {Object} headers (optional)
 */

function post(url, data, headers) {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'POST',
      body: JSON.stringify(data)
    };

    const endpoint = `https://${BASE}:${PORT}${url}`
    if (headers) { options.headers = headers; }
    else { options.headers = { 'Accept': 'application/json', 'Content-Type': 'application/json'} }
    request(endpoint, options)
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
      if (res_json.error) { reject(res_json.error) }
      resolve(res_json);
    })
    .catch((err) => { reject(err); })
  })
}

//======================================
// Common interactions
//======================================

// Sign in with a JSON web token, signed by the private key held by this device.
// 1 - Request the piece of data to sign
// 2 - Sign and return that data to /Authenticate
// 3 - Receive (and return) JSON web token to use for authenticated routes
//
// @param overwrite - if true, disregard saved JWT
exports.signIn = function(overwrite) {
  return new Promise((resolve, reject) => {
    let owner_addr;
    Keys.getAddress()
    .then((addr) => {
      console.log('signIn::addr', addr)
      owner_addr = addr;
      return Fs.read('jwt')
    })
    .then((jwt) => {
      console.log('signIn::jwt', jwt)
      console.log('owner_addr', owner_addr, '!owner_addr', !owner_addr)
      if (!owner_addr) {
        resolve(null)
      } else if ((!jwt || overwrite)) {
        // If there is already a JSON-Web-Token saved to disk, use it
        // Route /AuthDatum returns the string to sign
        return get('/AuthDatum')
        .then((d) => {
          // ecsign requires a hash of a message and a private key
          let msg = sha3(d.result);
          return Keys.ecsign(msg, false)
        })
        .then((sig) => {
          // POST the address that signed the message and the signature itself
          let data = { owner: owner_addr, sig: sig }
          return post('/Authenticate', data)
        })
        .then((res) => {
          // If there is an error in the API response, reject it.
          if (res.err) { reject(res.err); }
          else {
            // If no error, write the JSON web token to disk (DATADIR/jwt)
            // And resolve the JSON web token for use after this function.
            return Fs.write(Fs.BASE_DIR + '/jwt', res.result)
            .then((success) => {
              if (!success) { reject('Could not save JSON web token to disk.') }
              else { resolve(res.result); }
            })
            .catch((err) => { reject(err); })
          }
        })
        .catch((err) => { reject(err); })
      } else {
        resolve(jwt)
      }
    })
    .catch((err) =>  { reject(err) })
  })
}

// Save a user to the DB via the Grid+ API
exports.saveUser = function(jwt) {
  return new Promise((resolve, reject) => {
    if (!jwt) { resolve(null); }
    else {
      checkUser(jwt)
      .then((exists) => {
        if (exists) { resolve(true); }
        else {
          let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': jwt
          };
          get('/Signup', headers)
          .then((success) => { resolve(true) })
          .catch((err) => { reject('Could not sign up user') })
        }
      })
      .catch((err) => { reject(err); })
    }
  })
}

// Check if a user has been saved to the DB. Returns boolean.
function checkUser(jwt) {
  return new Promise((resolve, reject) => {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': jwt
    };
    get('/UserId', headers)
    .then((res) => {
      let id = res.result
      if (id == false || !id) { resolve(false) }
      else { resolve(true) }
    })
    .catch((err) => { reject('Could not check for user.') })
  })
}

// Get a set of bills for a user
// Resolves an array of form
// [
//   {
//     x: the x-axis value, a timestamp
//     y: the y-axis value, the amount
//   }
// ]
exports.getBills = function(params) {
  return new Promise((resolve, reject) => {
    let bills = [];
    post('/Bills', params)
    .then((res) => {
      return Promise.resolve(res.result)
    })
    .map((bill) => {
      let tmp = {
        x: bill.createdAt,
        y: bill.amount
      }
      _bills.push(tmp);
      return;
    })
    .then(() => { resolve(bills); })
    .catch((err) => { reject(err); })
  })
}
