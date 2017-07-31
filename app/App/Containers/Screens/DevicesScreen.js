// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
// import { Divider, FormLabel, FormInput } from 'react-native-elements'
import RoundedButton from '../../Components/RoundedButton'
import { Images } from '../../Themes'
var Device = require('../Util/Device.js');

// Styles
import styles from '../Styles/LaunchScreenStyles'

//=====================================================
// RegisterScreen
//=====================================================
export default class RegisterScreen extends Component {

  state = {
    devices: []
  }

  componentDidMount() {
    Device.getSerial()
    .then((s) => {
      this.state.devices.push(s)
      this.forceUpdate();
    })
  }

  renderDeviceList() {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View>
          <Image source={Images.coloredLogo} style={styles.logo} />
        </View>
        <View>
          <Text>testing</Text>
        </View>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={styles.container}>
          <View style={styles.section}>
            {this.renderDeviceList()}
          </View>
        </ScrollView>
      </View>
    )
  }
}
