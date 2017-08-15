// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../../Styles/Styles').Styles
import { Text, Image, View } from 'react-native'
import { Card } from 'react-native-elements'

// Local imports
var Device = require('../Util/Device.js');
var Keys = require('../Util/Keys.js');
var Api = require('../Util/Api.js');
let config = require('../../config.js');
let sha3 = require('js-sha3').keccak256;

// Styles
import styles from '../../Styles/LaunchScreenStyles'

//=====================================================
// RegisterScreen
//=====================================================
export default class DevicesScreen extends Component {

  constructor() {
    super()
  }

  state = {
    devices: [],
    navigate: null,
  }

  /*componentDidMount() {
    let serial;
    let owner_addr;
    let registry_addr;
    let bolt_addr;
    let device_addr;
    let bolt_balance;

    Device.getSerial()
    .then((s) => {
      serial = s;
      return Keys.getKey();
    })
    .then((mnemonic) => {
      owner_addr = Keys.address(mnemonic)
      return Api.get('/Registry')
    })
    .then((registry) => {
      console.log('registry_addr', registry)
      registry_addr = registry.result;
      return Device.getDeviceAddr(serial, owner_addr)
    })
    .then((wallet_addr) => {
      device_addr = wallet_addr;
      // Get the BOLT address
      return Api.get('/BOLT')
    })
    .then((bolt) => {
      console.log('bolt_addr', bolt)
      // Get the BOLT balance
      bolt_addr = bolt.result;
      // ABI getBalance(address)
      let data = `0x70a08231${config.zfill(device_addr)}`
      return config.eth.call({ to: registry_addr, data: data })
    })
    .then((balance) => {
      bolt_balance = balance;
      console.log('bolt_balance', bolt_balance)
    })
    .catch((err) => { console.log('ERROR:', err)})
  }*/

  renderDeviceList() {
    console.log('this.props', this.props)
    let { devices } = this.props.data;
    console.log('devices', devices)
    if (devices.length == 0){
      return (<Text>You have no devices</Text>)
    } else {
      // NOTE: BOLT has 8 decimals
      let bolt_bal = devices[0].bolt / Math.pow(10, 8) || '0.00'
      return (
        <View style={{alignItems:'center'}}>
          <Image source={require('../../Images/AgentRender_medium.png')}/>
          <Text style={{fontWeight:'bold'}}>Agent v1 </Text>
          <Text>Serial: {devices[0].serial || ''}</Text>
          <Text>Balance: ${devices[0].bolt || '0.00'}</Text>
        </View>
      )
    }
  }

  render () {
    return (
      <Card title="My Devices">
        {this.renderDeviceList()}
      </Card>
    )
  }
}
