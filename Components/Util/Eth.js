// Util functions for Ethereum transactions
var Promise = require('bluebird').Promise;
var config = require('../../config.js');
const rlp = require('rlp');
const elliptic = require('elliptic');
const secp256k1 = new (elliptic.ec)('secp256k1');
const numberToBN = require('number-to-bn');
const signer = require('ethjs-signer');

const Keys = require('./Keys.js')
import '../../shim.js'


// Form an unsigned transaction given the components
// This will automatically and synchronously find the account nonce
exports.formUnsigned = function(from, to, data, _gas, _gasPrice, _value) {
  return new Promise((resolve, reject) => {
    config.eth.getTransactionCount(from)
    .then((nonce) => {
      let gas = _gas || 100000;
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
    console.log('unsigned', unsigned)
    console.log('privatekey', privateKey)
    let raw = signer.sign(unsigned, privateKey);
    console.log('raw', raw)
    config.eth.sendRawTransaction(raw)
    .then((receipt) => { resolve(receipt) })
    .catch((err) => { reject(err) })
  })
}
