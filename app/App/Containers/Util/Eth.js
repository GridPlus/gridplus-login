// Util functions for Ethereum transactions
var Promise = require('bluebird').Promise;
var config = require('../../../config.js');
const rlp = require('rlp');
const elliptic = require('elliptic');
const secp256k1 = new (elliptic.ec)('secp256k1');
const numberToBN = require('number-to-bn');

const Keys = require('./Keys.js')
import '../../../shim.js'


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
    let raw = sign(unsigned, privateKey);
    config.eth.sendRawTransaction(raw)
    .then((receipt) => { resolve(receipt) })
    .catch((err) => { reject(err) })
  })
}



// ethjs-signer utils
//-------------------------------------------------
const transactionFields = [
  { name: 'nonce', maxLength: 32, number: true },
  { name: 'gasPrice', maxLength: 32, number: true },
  { name: 'gasLimit', maxLength: 32, number: true },
  { name: 'to', length: 20 },
  { name: 'value', maxLength: 32, number: true },
  { name: 'data' },
];
function stripZeros(buffer) {
  var i = 0; // eslint-disable-line
  for (i = 0; i < buffer.length; i++) {
    if (buffer[i] !== 0) { break; }
  }
  return (i > 0) ? buffer.slice(i) : buffer;
}

function padToEven(str) {
  return str.length % 2 ? `0${str}` : str;
}

function bnToBuffer(bn) {
  return stripZeros(new Buffer(padToEven(bn.toString(16))));
}

function stripHexPrefix(s) {
  if (s.substr(0,2) == '0x') { return s.substr(2, s.length) }
  else { return s }
}

//-------------------------------------------------

exports.sign = sign;
// Sign a transaction and return the raw tx hex string
// Forked from ethjs. Uses different buffer, since
// react-native chokes on things like Buffer.from('mystring', 'hex')
function sign(transaction, privateKey) {
  if (typeof transaction !== 'object' || transaction === null) {
    throw new Error(`Transaction input must be a type 'object', got '${typeof(transaction)}'`);
  }
  if (typeof privateKey !== 'string') {
    throw new Error('Private key input must be a string');
  }
  if (!privateKey.match(/^(0x)[0-9a-fA-F]{64}$/)) {
   throw new Error('Invalid private key value, private key must be a prefixed hexified 32 byte string (i.e. "0x..." 64 chars long).');
  }

  const raw = [];

  transactionFields.forEach((fieldInfo) => {
    var value = new Buffer(0);

    // shim for field name gas
    const txKey = (fieldInfo.name === 'gasLimit' && transaction.gas) ? 'gas' : fieldInfo.name;

    if (typeof transaction[txKey] !== 'undefined') {
      if (fieldInfo.number === true) {
        value = bnToBuffer(numberToBN(transaction[txKey]));
      } else {
        value = new Buffer(padToEven(stripHexPrefix(transaction[txKey])), 'hex');
      }
    }

    // Fixed-width field
    if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
      throw new Error(`While signing raw transaction, invalid '${fieldInfo.name}', invalid length should be '${fieldInfo.length}' got '${value.length}'`);
    }

    // Variable-width (with a maximum)
    if (fieldInfo.maxLength) {
      value = stripZeros(value);
      if (value.length > fieldInfo.maxLength) {
        throw new Error(`While signing raw transaction, invalid '${fieldInfo.name}' length, the max length is '${fieldInfo.maxLength}', got '${value.length}'`);
      }
    }

    raw.push(value);
  });

  // private key is not stored in memory
  let msg = Keys.hash(rlp.encode(raw));
  let mbuf = Buffer.from(msg);
  let pbuf = Buffer.from(privateKey);
  const signature = secp256k1.keyFromPrivate(pbuf).sign(mbuf, { canonical: true });
  raw.push(new Buffer([27 + signature.recoveryParam]));
  raw.push(bnToBuffer(signature.r));
  raw.push(bnToBuffer(signature.s));
  return `0x${rlp.encode(raw).toString('hex')}`;
}
