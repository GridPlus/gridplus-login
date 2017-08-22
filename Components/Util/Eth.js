// Util functions for Ethereum transactions
var Promise = require('bluebird').Promise;
var config = require('../../config.js');
const rlp = require('rlp');
const elliptic = require('elliptic');
const secp256k1 = new (elliptic.ec)('secp256k1');
const numberToBN = require('number-to-bn');
const signer = require('./ethjs-signer.js');

const Keys = require('./Keys.js')
import '../../shim.js'

exports.call = call;

// Form an unsigned transaction given the components
// This will automatically and synchronously find the account nonce
exports.formUnsigned = function(from, to, data, _gas, _gasPrice, _value) {
  return new Promise((resolve, reject) => {
    config.eth.getTransactionCount(from)
    .then((nonce) => {
      let gas = _gas || 80000;
      let gasPrice = _gasPrice || 2000000000; // Default 2 GWei
      let value = _value || 0;
      let tx = {
        from: from,
        to: to,
        data: data,
        value: `0x${value.toString(16)}`,
        gas: `0x${gas.toString(16)}`,
        gasPrice: `0x${gasPrice.toString(16)}`,
        nonce: `0x${nonce.toString(16)}`
      };
      resolve(tx)
    })
    .catch((err) => { reject(err) })
  })
}

exports.submitTx = function(unsigned, privateKey) {
  return new Promise((resolve, reject) => {
    let raw = signer.sign(unsigned, privateKey);
    config.eth.sendRawTransaction(raw)
    .then((receipt) => { resolve(receipt) })
    .catch((err) => { reject(err) })
  })
}

function call(to, data) {
  return new Promise((resolve, reject) => {
    config.eth.call(to, data)
    .then((result) => { resolve(result) })
    .catch((err) => { reject(err) })
  })
}


//==========================================
// Pre-formatted calls
//==========================================

exports.tokenBalance = function(token, addr) {
  return new Promise((resolve, reject) => {
    if (!token || !addr) { resolve(null); }
    else {
      // ABI getBalance(address)
      let data = `0x70a08231${config.zfill(addr)}`
      call({ to: token, data: data })
      .then((bal) => { resolve(parseInt(bal)); })
      .catch((err) => { reject(err); })
    }
  })
}
