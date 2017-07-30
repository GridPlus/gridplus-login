// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
import { Divider, FormLabel, FormInput } from 'react-native-elements'
import DevscreensButton from '../../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../../Components/RoundedButton'
import LaunchScreen from '../LaunchScreen'
import { Images } from '../../Themes'
let Device = require('../Util/Device.js')

// Styles
import styles from '../Styles/LaunchScreenStyles'

//=====================================================
// RegisterScreen
//=====================================================
export default class RegisterScreen extends Component {

  state = {
    tmp: null,
    s: null,
    serial_error: false,
    serial_entered: false,
  }

  componentDidMount() {
    // Get a key (if one exists) and rerender
    Device.getSerial()
    .then((s) => {
      this.state.s = s;
      this.forceUpdate();
    })
  }

  renderEnterSerialError() {
    if (this.state.serial_error) {
      return (<Text style={Styles.errorText}>The serial number you entered did not match our records. Make sure you enter it exactly as it appears</Text>)
    } else {
      return;
    }
  }

  renderEnterSerial() {
    return (
      <View style={styles.section}>
        <Text style={Styles.titleText}>Enter Serial Number</Text>
        <Text style={Styles.centerText}>This number is printed on your agent's box and may contain letters. Please enter it as it is printed.</Text>
        {this.renderEnterSerialError()}
        <FormLabel>Serial Number:</FormLabel>
        <FormInput onChangeText={(text) => { this.state.tmp = text;} }/>
        <RoundedButton
          onPress={() => {
            Device.lookupSerial(this.state.s)
            .then((pass) => {
              // TODO: take this out when the contracts are set up on INFURAnet
              // pass = true
              if (!pass) {
                this.state.serial_error = true;
              } else {
                this.state.serial_error = false;
                this.state.serial_entered = true;
                this.state.s = this.state.tmp;
              }
              this.forceUpdate();
            })
          }}
        >
          Submit
        </RoundedButton>
      </View>
    )
  }

  renderContent() {
    if (!this.state.s && (!this.state.serial_entered || this.state.serial_error)) {
      return this.renderEnterSerial()
    } else {
      return (<LaunchScreen/>)
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View>
            {this.renderContent()}
          </View>
        </ScrollView>
      </View>
    )
  }
}
