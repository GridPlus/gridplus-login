// Util functions for storing and retrieving a serial number saved to disk
let Promise = require('bluebird').Promise;
let fs = require('./Fs.js');
let api = require('./Api.js');
let config = require('../../config.js');
let keys = require('./Keys.js');
var sha3 = require('js-sha3').keccak256;

// The default path for the registered serial number
const SERIAL_PATH = fs.BASE_DIR + '/serial'

exports.saveSerial = saveSerial;
exports.getSerial = getSerial;
exports.getDeviceAddr = getDeviceAddr;
exports.lookupSerial = lookupSerial;
exports.isOwner = isOwner;

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

// Get the address of the device.
// Returns the device address or 'null' if the device has not yet registered
// a wallet address.
function getDeviceAddr(registry, serial, owner) {
  return new Promise((resolve, reject) => {
    // Soft failure because there will be many cases where this is true
    if (!registry || !serial || !owner) { resolve(null) }
    else {
      // First check if the owner is the registered owner
      isOwner(registry, serial, owner)
      .then((is_owner) => {
        if (is_owner) {
          // Get the wallet address of this device
          // ABI get_owner_wallet(bytes32,address)
          let data = `0x5934df54${config.zfill(sha3(serial))}${config.zfill(owner)}`
          config.eth.call({ to: registry, data: data })
          .then((addr) => {
            if (addr == '0x') { resolve(null); }
            else { resolve(addr); }
          })
          .catch((err) => { reject(err); })
        } else {
          resolve(null)
        }
      })
      .catch((err) => { reject(err) })
    }
  })
}

// Check to see if an address has claimed a particular serial number
function isOwner(registry, serial, owner) {
  return new Promise((resolve, reject) => {
    // Soft failure because there will be many cases where this is true
    if (!registry || !serial || !owner) { resolve(null) }
    else {
      // Get the wallet address of this device
      // ABI check_owner(bytes32,address)
      let data = `0xf9d0bbee${config.zfill(sha3(serial))}${config.zfill(owner)}`

      config.eth.call({ to: registry, data: data })
      .then((claimed) => { resolve(Boolean(Number(claimed))) })
      .catch((err) => { reject(err); })
    }
  })
}


// Look up a serial number (by its hash) on the blockchain
// Returns true if it has been whitelisted by grid+
function lookupSerial(s) {
  return new Promise((resolve, reject) => {
    let hash = sha3(s);
    api.get('/Registry')
    .then((res) => {
      let data = `0x5524d548${config.zfill(hash)}`
      let registry_addr = res.result;
      return config.eth.call({ to: registry_addr, data: data})
    })
    .then((is_registered) => {
      console.log('------\n', 'is_registered', is_registered, '\n-------')
      if (parseInt(is_registered) && parseInt(is_registered) == 1) {
        return saveSerial(s).then(() => { resolve(true) });
      }
      else { resolve(false); }
    })
    .catch((err) => { reject(err); })

  })
}
