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
    // Make sure this device is authenticated with the Grid+ API
    Api.signIn()
    .then((jwt) => {
      if (jwt) { this.setState({ jwt: jwt }) }
      // Get the address belonging to the keypair stored on this device.
      return Keys.getAddress()
    })
    .then((addr) => {
      if (addr) { this.setState({owner_addr: addr}) }
      else {
        params.jwt = this.state.jwt;
        this.setState({ cache: true });  // Currently in another screen
        navigate('Setup', params)
      }
      // If a serial number has been saved to disk, retrieve it
      return Device.getSerial()
    })
    .then((serial) => {
      if (serial) { this.setState({s: serial}) }
      else if (!this.state.cache) {
        params.jwt = this.state.jwt;
        this.setState({ cache: true });  // Currently in another screen
        navigate('RegisterDevice', params)
      }
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
      let addr = null;
      if (this.state.devices) { addr = this.state.devices[0].addr; }
      return Eth.tokenBalance(this.state.bolt_addr, addr)
    })
    .then((bolt_bal) => {
      let devices = this.state.devices;
      if (devices) {
        devices[0].bolt = bolt_bal
        this.setState({devices: devices})
      }
      // See if the user has an account on the Grid+ DB
      return Api.saveUser(this.state.jwt)
    })
    .then(() => {
      console.log('this.state.cache', this.state.cache)
      // Go to the setup screen if needed. This will generate or recover a key
      // pair to save on device. This is the "owner" key
      if (
        !this.state.cache &&
        (
          this.state.owner_addr === undefined || !this.state.owner_addr ||
          (params != undefined && (
            params.route == 'setup' &&
            (params.enter_phrase && !params.phrase_matches) ||
            (params.enter_phrase === false && (!params.seed_written || !params.double_check || !params.signed_up))
          ))
        )
      ) {
        params.jwt = this.state.jwt;
        navigate('Setup', params)
      }
      // If the owner doesn't have a serial number/device saved, set one up.
      else if (
        !this.state.cache &&
        (!this.state.devices || !this.state.devices[0].serial || !this.state.devices[0].addr)
      ) {
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
    let device_props = {
      jwt: this.state.jwt,
      devices: this.state.devices,
      bolt_addr: this.state.bolt_addr,
    }
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
