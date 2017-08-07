// Filesystem util Functions
let Promise = require('bluebird').Promise;
let ifs = require('react-native-fs');

exports.write = write;
exports.read = read;
exports.readDir = readDir;
exports.hash = hash;
exports.readState = readState;
exports.writeState = writeState;
exports.clearState = clearState;

exports.BASE_DIR = ifs.DocumentDirectoryPath;

// Application state is written to disk
const STATE_PATH = ifs.DocumentDirectoryPath + "/state";

function write(path, data, encoding) {
  return new Promise((resolve, reject) => {
    let enc = encoding || 'utf8';
    ifs.writeFile(path, data, enc)
    .then((success) => { resolve(true); })
    .catch((err) => { reject(err); })
  })
}

function read(path) {
  return new Promise((resolve, reject) => {
    console.log('bas_dir', ifs.DocumentDirectoryPath)
    ifs.exists(path)
    .then((exists) => {
      if (exists) { return ifs.readFile(path) }
      else { return null; }
    })
    .then((data) => { resolve(data); })
    .catch((err) => { resolve(null); })
  })
}

function readDir(path) {
  return new Promise((resolve, reject) => {
    ifs.readDir(path)
    .then((data) => { resolve(data); })
    .catch((err) => { resolve(null); })
  })
}

function hash(path, algo) {
  return new Promise((resolve, reject) => {
    let alg = algo || 'sha512';
    ifs.hash(path, alg)
    .then((data) => { resolve(data); })
    .catch((err) => { resolve(null); })
  })
}

// Write application state to a json file
function writeState(obj) {
  return new Promise((resolve, reject) => {
    read(STATE_PATH)
    .then((state) => {
      let j = {};
      // If the state exists, load it
      if (state) { j = JSON.parse(state); }
      // Write all keys (this will overwrite old state)
      let keys = Object.keys(obj);
      for (let i=0; i<keys.length; i++) { j[keys[i]] = obj[keys[i]]; }
      // Write the file
      return write(STATE_PATH, JSON.stringify(j))
    })
    .then(() => { resolve(true) })
    .catch((err) => { reject(err) })
  })
}

// Read application state (JSON format)
function readState() {
  return new Promise((resolve, reject) => {
    read(STATE_PATH)
    .then((state) => { console.log('STATE?', state); resolve(JSON.parse(state)) })
    .catch((err) => { reject(err) })
  })
}

// Clear the application state (keep the file)
function clearState() {
  return new Promise((resolve, reject) => {
    write(STATE_PATH, '')
    .then(() => { resolve(true) })
    .catch((err) => { reject(err) })
  })
}
