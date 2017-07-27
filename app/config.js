exports.api = {
  "base_url": "http://localhost",
  "port": 3000
}

/*var web3 = require('web3');
var web3_provider = 'http://localhost';
var web3_port = '8545';
var _web3 = new web3();
_web3.setProvider(new web3.providers.HttpProvider(`${web3_provider}:${web3_port}`));
exports.web3 = _web3;
*/

//const HttpProvider = require('./App/Containers/Util/ethjs-provider-http.js');
//const Eth = require('ethjs-query');
//const eth = new Eth(new HttpProvider('http://localhost:8545'));
exports.eth = null;

exports.zfill = function(num) { if (num.substr(0,2)=='0x') num = num.substr(2, num.length); var s = num+""; while (s.length < 64) s = "0" + s; return s; }
