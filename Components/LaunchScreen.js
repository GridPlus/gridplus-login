// This is the main landing screen for users who have already set up their keys

import React, { Component } from 'react'
import { ScrollView, Text, Image, View, TouchableOpacity } from 'react-native'
// import SetupScreen from './Screens/SetupScreen'
// import RegisterDeviceScreen from './Screens/RegisterDeviceScreen'

var Keys = require('./Util/Keys.js');
var Device = require('./Util/Device.js');
var Api = require('./Util/Api.js');
var Fs = require('./Util/Fs.js');
var Alert = require('./Util/Alert.js');

// Styles
import styles from '../Styles/LaunchScreenStyles'
import PrimaryNav from '../Navigation/AppNavigation.js'


export default class LaunchScreen extends Component {

  state = {
    m: null,
    owner_addr: null,
    device_addr: null,
    s: null,
    navigate: null,
    registry_addr: null,
  }

  // This is the main app screen. Each time it loads, we want to load up the
  // necessary pieces of our app state.
  componentDidMount() {
    const { navigation }  = this.props;
    const { navigate } = navigation;
    const params = navigation.state.params || {};
    this.state.navigate = navigate;
    // Get the address belonging to the keypair stored on this device.
    Keys.getAddress()
    .then((addr) => {
      this.state.owner_addr = addr;
      // If a serial number has been saved to disk, retrieve it
      return Device.getSerial()
    })
    .then((serial) => {
      this.state.s = serial;
      // Get the Ethereum address of the registry contract
      return Api.get('/Registry')
    })
    .then((registry) => {
      this.state.registry_addr = registry.result;
      // Check if this device is registered to the owner
      return Device.getDeviceAddr(this.state.registry_addr, this.state.s, this.state.owner_addr)
    })
    .then((device) => {
      this.state.device_addr = device;
      // Make sure this device is authenticated with the Grid+ API
      return Api.signIn()
    })
    .then((jwt) => {
      this.state.jwt = jwt;

      // Go to the setup screen if needed. This will generate or recover a key
      // pair to save on device. This is the "owner" key
      if (this.state.owner_addr === undefined || !this.state.owner_addr ||
        params != undefined && (
          params.route == 'setup' &&
          (params.enter_phrase && !params.phrase_matches) ||
          (params.enter_phrase === false && (!params.seed_written || !params.double_check))
        )
      ) {
        navigate('Setup', params)
      }
      // If the owner doesn't have a serial number/device saved, set one up.
      else if (!this.state.s || !this.state.device_addr) {
        params.jwt = this.state.jwt;
        navigate('RegisterDevice', params)
      }
      // If both of the above conditions are bypassed, we can launch this screen.
    })
    .catch((err) => {
      Alert.alert('Error', String(err))
    })
  }

  render () {
    this.state.navigate = this.props.navigation.navigate;
    return (
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionText}>
              Welcome to your Grid+ Portal
            </Text>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text>Hello</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
