exports.api = {
  "base_url": "app.gridplus.io",
  "port": 3001
}

const HttpProvider = require('./App/Containers/Util/ethjs-provider-http.js');
const Eth = require('ethjs-query');
const eth = new Eth(new HttpProvider('https://infuranet.infura.io'));
exports.eth = eth;

exports.zfill = function(num) { if (num.substr(0,2)=='0x') num = num.substr(2, num.length); var s = num+""; while (s.length < 64) s = "0" + s; return s; }
