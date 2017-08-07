// This is the main landing screen for users who have already set up their keys

import React, { Component } from 'react'
import { ScrollView, Text, Image, View, TouchableOpacity } from 'react-native'
// import SetupScreen from './Screens/SetupScreen'
// import RegisterDeviceScreen from './Screens/RegisterDeviceScreen'

var Keys = require('./Util/Keys.js');
var Device = require('./Util/Device.js');
var Api = require('./Util/Api.js');
var Fs = require('./Util/Fs.js');

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

  /*componentDidMount() {
    const { navigation }  = this.props;
    const { navigate } = navigation;
    const { params } = navigation.state;
    this.state.navigate = navigate;
    Keys.getAddress()
    .then((addr) => {
      this.state.owner_addr = addr;
      return Device.getSerial()
    })
    .then((serial) => {
      this.state.s = serial;
      return Api.get('/Registry')
    })
    .then((registry) => {
      this.state.registry_addr = registry.result;
      return Device.getDeviceAddr(this.stateregistry_addr, this.state.s, this.state.owner_addr)
    })
    .then((device) => {
      this.state.device_addr = device;
      if (!this.state.owner_addr ||
        params != undefined && (
          params.route == 'setup' &&
          (params.enter_phrase && !params.phrase_matches) ||
          (params.enter_phrase === false && (!params.seed_written || !params.double_check))
        )
      ) {
        x=1
        //navigate('Setup', params)
      }
      else if (!this.state.s || !this.state.device_addr) {
        //navigate('RegisterDevice', params)
        x=2
      }
    })
  }*/

  //openDevices() { this.state.navigate('Devices') }

  /*render () {
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
  }*/
  render () {
    return (<Text>wassup</Text>)
  }
}
