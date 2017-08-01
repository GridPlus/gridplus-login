// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
import { Divider, FormLabel, FormInput } from 'react-native-elements'
import DevscreensButton from '../../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../../Components/RoundedButton'
import LaunchScreen from '../LaunchScreen'
import { Images } from '../../Themes'
import { Button, Card } from 'react-native-elements'
let Device = require('../Util/Device.js')
let Keys = require('../Util/Keys.js')
let Api = require('../Util/Api.js')
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
    no_wallet: false,
    device_addr: null,
    owner_addr: null,
    card_title: "Enter Serial Number",
    registry_addr: null
  }

  // On mount, get the owner and device addresses
  // as well as the serial number (if it exists)
  componentDidMount() {
    Device.getSerial()
    .then((s) => {
      this.state.s = s;
      return Keys.getAddress()
    })
    .then((a) => {
      this.state.owner_addr = a;
      return Api.get('/Registry')
    })
    .then((registry) => {
      this.state.registry_addr = registry.result;
      return Device.getDeviceAddr(this.state.registry_addr, this.state.s, this.state.owner_addr)
    })
    .then((device) => {
      this.state.device_addr = device;
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
        <Text>This number is printed on your agent's box and may contain letters. Please enter it as it is printed.</Text>
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

  renderSetupDevice() {
    return (
      <View style={styles.section}>
        <Text style={{textAlign: 'center'}}>Your agent is not yet registered. Please ensure it is turned on and connected to the internet.</Text>
        <Button style={{marginTop: 50}} title="Refresh" onPress={() => { this.props.navigation.navigate('LaunchScreen') }}></Button>
      </View>
    )
  }

  renderContent() {
    if (!this.state.device_addr) {
      return this.renderSetupDevice()
    } else if (!this.state.s && (!this.state.serial_entered || this.state.serial_error)) {
      return this.renderEnterSerial()
    } else {
      this.props.navigation.navigate('LaunchScreen');
      return;
    }
  }

  render () {
    if (this.state.device) { this.state.card_title = "Enter Serial Number" }
    else { this.state.card_title = "Please Setup Device"}
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Card title={this.state.card_title}>
              {this.renderContent()}
            </Card>
          </View>
        </ScrollView>
      </View>
    )
  }
}
