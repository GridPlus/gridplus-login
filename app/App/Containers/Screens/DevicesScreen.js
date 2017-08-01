// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
import { Button, Card } from 'react-native-elements'
import RoundedButton from '../../Components/RoundedButton'
import { Images } from '../../Themes'

// Local imports
var Device = require('../Util/Device.js');
var Keys = require('../Util/Keys.js');
var Api = require('../Util/Api.js');
let config = require('../../../config.js');
let sha3 = require('js-sha3').keccak256;

// Styles
import styles from '../Styles/LaunchScreenStyles'
import Colors from '../../Themes/Colors.js'

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
    Device.getSerial()
    .then((s) => {
      serial = s;
      return Keys.getKey();
    })
    .then((mnemonic) => {
      // get_owner_wallet(bytes32 serial_hash, address owner)
      let data = `0x5934df54${config.zfill(sha3(serial))}`
      let addr = Keys.address(mnemonic)
      // getBalance(address)
      //let data = `0x70a08231${config.zfill()}`

      this.state.devices.push(serial)
      this.forceUpdate();
    })
  }

  renderDeviceList() {
    if (this.state.devices.length == 0){
      return (<Text>You have no devices</Text>)
    } else {
      return (
        <View style={styles.section}>
          <Image source={Images.agent} style={styles.agent} />
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
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{backgroundColor: Colors.background}}>
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
