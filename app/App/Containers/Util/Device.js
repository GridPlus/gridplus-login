// Util functions for storing and retrieving a serial number saved to disk
let Promise = require('bluebird').Promise;
let fs = require('./Fs.js');

// The default path for the registered serial number
const SERIAL_PATH = fs.BASE_DIR + '/serial'

exports.saveSerial = saveSerial;
exports.getSerial = getSerial;

// Given a serial number input by the user, save it to disk
function saveSerial(s) {
  return new Promise((resolve, reject) => {
    fs.write(SERIAL_PATH, s, 'utf8')
    .then((success) => { resolve(s); })
    .catch((err) => { reject(err); });
  })
}

// Retrieves a serial number from disk if it exists
function getSerial() {
  return new Promise((resolve, reject) => {
    fs.read(SERIAL_PATH)
    .then((data) => { resolve(data); })
    .catch((err) => { reject(err); })
  })
}
