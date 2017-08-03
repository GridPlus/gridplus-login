// Util functions for Ethereum transactions
var Promise = require('bluebird').Promise;
var config = require('../../../config.js');

exports.formUnsigned = function(from, to, data, _gas, _gasPrice, _value) {
  let nonce = config.eth.getTransactionCount(from)
  console.log('nonce', nonce)
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
  return tx;
}
