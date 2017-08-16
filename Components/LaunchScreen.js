// This is the main landing screen for users who have already set up their keys

import React, { Component } from 'react'
import { ScrollView, Text, Image, View, TouchableOpacity } from 'react-native'
import { Icon, Header } from 'react-native-elements'
var ScrollableTabView = require('react-native-scrollable-tab-view');

// Local imports
var Keys = require('./Util/Keys.js');
var Device = require('./Util/Device.js');
var Api = require('./Util/Api.js');
var Fs = require('./Util/Fs.js');
var Eth = require('./Util/Eth.js');
var Alert = require('./Util/Alert.js');
var config = require('../config.js');

// Screens
import UsageScreen from './Screens/UsageScreen'
import DevicesScreen from './Screens/DevicesScreen'


// Styles
import styles from '../Styles/LaunchScreenStyles'
import PrimaryNav from '../Navigation/AppNavigation.js'


export default class LaunchScreen extends Component {

  constructor() {
    super()
    this.state = {
      m: null,
      owner_addr: null,
      device_addr: null,
      s: null,
      navigate: null,
      registry_addr: null,
      selectedTab: 'usage'
    }
  }
  /*state = {
    m: null,
    owner_addr: null,
    device_addr: null,
    s: null,
    navigate: null,
    registry_addr: null,
  }*/

  changeTab (selectedTab) {
    this.setState({selectedTab})
  }


  // This is the main app screen. Each time it loads, we want to load up the
  // necessary pieces of our app state.
  componentDidMount() {
    const { navigation }  = this.props;
    const { navigate } = navigation;
    const params = navigation.state.params || {};

    this.setState({navigate: navigate})
    // Get the address belonging to the keypair stored on this device.
    Keys.getAddress()
    .then((addr) => {
      this.setState({owner_addr: addr})
      // If a serial number has been saved to disk, retrieve it
      return Device.getSerial()
    })
    .then((serial) => {
      this.setState({s: serial})
      // Get the Ethereum address of the registry contract
      return Api.get('/Registry')
    })
    .then((registry) => {
      this.setState({registry_addr: registry.result})
      // Check if this device is registered to the owner
      return Device.getDeviceAddr(this.state.registry_addr, this.state.s, this.state.owner_addr)
    })
    .then((device) => {
      // Strip this down from a 32 byte string
      if (device) {
        const device_addr = `0x${device.substr(26, 40)}`
        let devices = this.state.devices || [];
        devices.push({ addr: device_addr, serial: this.state.s })
        this.setState({devices: devices})
      }
      // Get the BOLT address
      return Api.get('/BOLT')
    })
    .then((bolt) => {
      this.setState({bolt_addr: bolt.result})
      // Get the BOLT held by the device
      // ABI getBalance(address)
      let data = '0x'
      if (this.state.devices) {
        data = `0x70a08231${config.zfill(this.state.devices[0].addr)}`
      }
      return Eth.call({ to: this.state.bolt_addr, data: data })
    })
    .then((bolt_bal) => {
      console.log('bolt_bal', bolt_bal)
      let devices = this.state.devices;
      if (devices) {
        devices[0].bolt = parseInt(bolt_bal)
        this.setState({devices: devices})
      }
      // Make sure this device is authenticated with the Grid+ API
      return Api.signIn()
    })
    .then((jwt) => {
      this.setState({ jwt: jwt })

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
      else if (!this.state.devices || !this.state.devices[0].serial || !this.state.devices[0].addr) {
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
    const { selectedTab } = this.state
    console.log('this.state', this.state)
    let device_props = {
      jwt: this.state.jwt,
      devices: this.state.devices,
      bolt_addr: this.state.bolt_addr,
    }
    console.log('device_props being passed', device_props)
    return (
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={styles.container}>
          <View style={{...styles.content, alignItems:'center'}}>
            <Image source={require('../Images/gridplus_logo.png')}/>
            <ScrollableTabView>
              <UsageScreen tabLabel="Usage" />
              <DevicesScreen tabLabel="Devices" data={device_props} />
            </ScrollableTabView>
          </View>
        </ScrollView>
      </View>
    )
  }
}
