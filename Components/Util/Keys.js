// Functions for extracting and saving keys from/to disk
//let crypto = require('crypto');
let bip39 = require('bip39');
// var elliptic = require('elliptic');
// const secp256k1 = new (elliptic.ec)('secp256k1');
let ethutil = require('./ethjs-account');
let Promise = require('bluebird').Promise;
// let ifs = require('react-native-fs');
let wordlist = require('../Setup/bip_39_words.json');
let fs = require('./Fs.js');
let sha3 = require('js-sha3').keccak256;

// Import this thing as a hack to get react-native-crypto to import :(
import '../../shim.js'

// The default path for the keystore
const KEY_PATH = fs.BASE_DIR + '/keystore'

exports.generateKey = generateKey;
exports.getKey = getKey;
exports.getPrivateKey = getPrivateKey;
exports.getAddress = getAddress;
exports.hash = hash;
exports.address = address;

// Generate a mnemonic/key via BIP39. Returns the mnemonic if generated.
function generateKey() {
  return new Promise((resolve, reject) => {
    let m;   // mnemonic
    // Get randomness from hashing all of the files in the bundle dir
    fs.readDir(fs.BASE_DIR)//ifs.MainBundlePath)
    .then((result) => {
      return Promise.map(result, (r) => {
        return hashFile(r)
      })
    })
    .then((stuff) => {
      // Concatenate, add timestamp, and hash it all
      let ts = new Date().getTime()
      stuff.push(ts.toString(16))
      let s = stuff.join("")
      let h = hash(s)
      // Create BIP39 mnemonic
      // Slice the hash to drop seed phrase size from 24 -> 12
      m = bip39.entropyToMnemonic(h.substr(0,32))
      // Save the mnemonic to the fs
      return fs.write(KEY_PATH, m, 'utf8')
    })
    .then((success) => { resolve(m); })
    .catch((err) => { reject(err); });
  })
}

function hash(s) {
  return sha3(s)
}

// See if a key exists. Returns the mnemonic or null
function getKey() {
  return new Promise((resolve, reject) => {
    fs.read(KEY_PATH)
    .then((m) => { resolve(m); })
    .catch((err) => { resolve(null); })
  })
}

// Get the raw private key (hex string)
function getPrivateKey() {
  return new Promise((resolve, reject) => {
    fs.read(KEY_PATH)
    .then((m) => {
      let priv = '0x'+bip39.mnemonicToSeedHex(m).substr(0, 64)
      resolve(priv);
    })
    .catch((err) => { reject(err); })
  })
}

// Get the key and convert it to an address on the spot
function getAddress() {
  return new Promise((resolve, reject) => {
    getKey()
    .then((m) => {
      if (!m) { resolve(null) }
      else { resolve(address(m)); }
    })
    .catch((err) => { reject(err); })
  })
}

// Get the Ethereum address of a saved mnemonic
function address(mnemonic) {
  // Convert seed mnemonic to private key via BIP39
  let priv = '0x' + bip39.mnemonicToSeedHex(mnemonic).substr(0, 64)
  let addr = ethutil.privateToAccount(priv).address
  return addr;
}

// Check a user-entered phrase against a wordlist.
// Returns true if the phrase matches
function checkPhrase(phrase) {
  let bad_word = false;
  for (let i=0; i<phrase.length; i++) {
    // lowercase and strip whitespace
    let word = phrase[i].toLowerCase().replace(/ /g,'');
    // Make sure all words match the wordlist
    if (wordlist.words.indexOf(word) == -1) {
      bad_word = true;
    }
  }
  return bad_word == false;
}

// Given a file system path, extract the data from a file and hash it
function hashFile(f) {
  return new Promise((resolve, reject) => {
    if (f.isFile()) {
      fs.hash(f.path, 'sha512')
      .then((data) => { resolve(data) })
      .catch((err) => { reject(err) })
    }
    else { resolve('0') }
  })
}
