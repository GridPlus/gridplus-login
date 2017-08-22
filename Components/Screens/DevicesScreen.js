// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../../Styles/Styles').Styles
import { Text, Image, View } from 'react-native'
import { Button, Card } from 'react-native-elements'

// Local imports
var Device = require('../Util/Device.js');
var Keys = require('../Util/Keys.js');
var Api = require('../Util/Api.js');
var Alert = require('../Util/Alert.js');
let config = require('../../config.js');
let sha3 = require('js-sha3').keccak256;
var Eth = require('../Util/Eth.js');

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

  addFunds() {
    let { jwt, devices, bolt_addr } = this.props.data;
    let addr = devices[0].addr;
    let error_msg = 'Payment was not processed correctly. Please try again later.'
    Api.post('/BuyBOLTCC', { token: jwt, recipient: addr })
    .then((receipt) => {
      if (receipt.error) { Alert.alert('Error', error_msg) }
      else {
        let data = `0x70a08231${config.zfill(addr)}`
        return Eth.call({ to: bolt_addr, data: data })
        .then((_new_bal) => {
          let new_bal = parseInt(_new_bal)
          Alert.alert('Success', 'You have successfully added funds to your device. Your new balance is $'+this.USD(new_bal))
          this.props.data.devices[0].bolt = new_bal
          this.forceUpdate()
        })
      }
    })
    .catch((err) => {
      Alert.alert('Error', error_msg)
    })
  }

  // Given a number of BOLT, convert it to USD
  USD(b) {
    if (!b) { return '0.00' }
    else {
      // BOLT has 8 decimals right now
      b /= Math.pow(10, 8);
      b = b.toFixed(2)
      return String(b)
    }
  }

  renderDeviceList() {
    let { devices } = this.props.data;
    if (devices.length == 0){
      return (<Text>You have no devices</Text>)
    } else {
      return (
        <View style={{alignItems:'center'}}>
          <Image source={require('../../Images/AgentRender_medium.png')}/>
          <Text style={{fontWeight:'bold'}}>Agent v1 </Text>
          <Text>Serial: {devices[0].serial || ''}</Text>
          <Text>Balance on device: <Text style={{fontWeight:'bold'}}>${this.USD(devices[0].bolt)}</Text></Text>

          <Button title="Add funds" style={{marginTop: 50}} onPress={() => this.addFunds()}/>
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
