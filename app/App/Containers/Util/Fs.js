// Filesystem util Functions
let Promise = require('bluebird').Promise;
let ifs = require('react-native-fs');

exports.write = write;
exports.read = read;
exports.readDir = readDir;
exports.hash = hash;

exports.BASE_DIR = ifs.DocumentDirectoryPath;

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
    ifs.readFile(path)
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
