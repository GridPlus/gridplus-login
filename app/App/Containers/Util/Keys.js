// Functions for extracting and saving keys from/to disk
let crypto = require('crypto');
let bip39 = require('bip39')
let ethutil = require('ethjs-account');
let Promise = require('bluebird').Promise;
let ifs = require('react-native-fs');
let wordlist = require('../Setup/bip_39_words.json');
let fs = require('./Fs.js');
let unorm = require('unorm');
let Buffer = require('buffer/').Buffer;
// Import this thing as a hack to get react-native-crypto to import :(
import '../../../shim.js'

// The default path for the keystore
const KEY_PATH = fs.BASE_DIR + '/keystore'

exports.generateKey = generateKey;
exports.getKey = getKey;
exports.hash = hash;
exports.address = address;

// Generate a mnemonic/key via BIP39. Returns the mnemonic if generated.
function generateKey() {
  return new Promise((resolve, reject) => {
    let m;   // mnemonic
    // Get randomness from hashing all of the files in the bundle dir
    fs.readDir(ifs.MainBundlePath)
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
  return crypto.createHash('sha256').update(s).digest("hex");
}

// See if a key exists. Returns the mnemonic or null
function getKey() {
  return new Promise((resolve, reject) => {
    fs.read(KEY_PATH)
    .then((m) => { resolve(m); })
    .catch((err) => { resolve(null); })
  })
}

// Get the Ethereum address of a saved mnemonic
function address(mnemonic) {
  console.log('mnemonic', mnemonic)
  // var mnemonicBuffer = Buffer.from(unorm.nfkd(mnemonic), 'utf8')
  // var saltBuffer = Buffer.from(salt(unorm.nfkd(password)), 'utf8')

  let tmp = mnemonic.split(' ').slice(0, 10)
  let tmp2 = tmp.join(' ')
  console.log('tmp', tmp)
  console.log('tmp2', tmp2)
  let priv = bip39.mnemonicToSeedHex(mnemonic)
  console.log('priv', priv)
  let pbuf = Buffer.from(priv.slice(2, 64), 'hex')
  // let pub = (Buffer.from(secp256k1.keyFromPrivate(Buffer.from(priv.slice(2), 'hex')).getPublic(false, 'hex'), 'hex')).slice(1)
  // console.log('pub', pub)
  // let addr = ethutil.pubToAddress(pub)
  let addr = 'tmp'
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
