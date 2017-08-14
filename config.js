exports.api = {
  "base_url": "localhost",
  "port": 3001
}

const HttpProvider = require('./Components/Util/ethjs-provider-http.js');
const Eth = require('ethjs-query');
const eth = new Eth(new HttpProvider('http://localhost:8545'));
exports.eth = eth;

exports.zfill = function(num) { if (num.substr(0,2)=='0x') num = num.substr(2, num.length); var s = num+""; while (s.length < 64) s = "0" + s; return s; }
