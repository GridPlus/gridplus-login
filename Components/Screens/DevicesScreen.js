// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
import { Button, Card } from 'react-native-elements'

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

  state = {
    devices: [],
    navigate: null,
  }

  componentDidMount() {
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
  }

  renderDeviceList() {
    if (this.state.devices.length == 0){
      return (<Text>You have no devices</Text>)
    } else {
      return (
        <View style={styles.section}>
          <Text style={{fontWeight:'bold'}}>Agent 1 Serial:</Text>
          <Text>{this.state.devices[0] || ''}</Text>
        </View>
      )
    }
  }

  render () {
    this.state.navigate = this.props.navigation.navigate;
    return (
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{backgroundColor: 'blue'}}>
          <View style={styles.section}>
            <Card title="My Devices">
              {this.renderDeviceList()}
            </Card>
            <Button title='Back' onPress={() => {this.state.navigate('LaunchScreen')}} />
          </View>
        </ScrollView>
      </View>
    )
  }
}
