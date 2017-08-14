// This screen will load if no wallet exists on the device.
import React, { Component } from 'react'
var Styles = require('../../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
import { Divider, FormLabel, FormInput } from 'react-native-elements'
import LaunchScreen from '../LaunchScreen'
import { Button, Card } from 'react-native-elements'
let Device = require('../Util/Device.js')
let Keys = require('../Util/Keys.js')
let Api = require('../Util/Api.js')
var Alert = require('../Util/Alert.js');
let Eth = require('../Util/Eth.js')
let config = require('../../config.js');
let Fs = require('../Util/Fs.js')
let sha3 = require('js-sha3').keccak256;


// Getting weird (incorrect) errors from bluebird. Really hard to debug,
// so disabling for now
import bluebird from 'bluebird';
bluebird.config({ warnings: false })


// Styles
import styles from '../../Styles/LaunchScreenStyles'

//=====================================================
// RegisterScreen
//=====================================================
export default class RegisterScreen extends Component {

  state = {
    tmp: null,
    s: null,
    serial_error: false,
    tx_error: false,
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
    return Device.getSerial()
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
      return Fs.read('jwt')
    })
    .then((jwt) => {
      // If there is a JSON-Web-Token, we are authenticated
      if (!jwt) {
        return Api.get('/AuthDatum')
        .then((d) => {
          let msg = sha3(d.result)
          return Keys.ecsign(msg, false)
        })
        .then((sig) => {
          let data = { owner: this.state.owner_addr, sig: sig }
          return Api.post('/Authenticate', data)
        })
        .then((res) => {
          if (res.err) { Alert.alert('Error', res.err)}
        })
        .catch((err) => { Alert.alert('Error', String(err)) })
      }
    })
    .catch((err) => { Alert.alert('Error', String(err)) })
  }

  // Form and sign a transaction
  claimDevice(serial_hash) {
    return new Promise((resolve, reject) => {
      let { owner_addr, registry_addr, s } = this.state;
      // Claim(bytes32)
      let data = `0xbd6652${Keys.hash(s)}`;
      let unsigned;
      Eth.formUnsigned(owner_addr, registry_addr, data)
      .then((_unsigned) => {
        unsigned = _unsigned;
        return Keys.getPrivateKey()
      })
      .then((p) => {
        return Eth.submitTx(unsigned, p)
      })
      .then((receipt) => {
        resolve(true)
      })
      .catch((err) => { reject(err) })
    })
  }

  // Request 1-time faucet distribution if the account has no ether
  getEther() {
    return new Promise((resolve, reject) => {
      Keys.getAddress()
      .then((addr) => {
        console.log('my address', addr)
        return config.eth.getBalance(addr)
      })
      .then((bal) => {
        let balance = bal.toNumber();
        if (bal < 100000) {
          return Api.post('/Faucet', )
        } else {
          resolve(true)
        }
      })
    })
  }

  renderEnterSerialError() {
    let { params } = this.props.navigation.state;
    if (params && params.serial_error) {
      return (<Text style={Styles.errorText}>The serial number you entered did not match our records. Make sure you enter it exactly as it appears</Text>)
    } else {
      return;
    }
    return
  }

  renderEnterSerial() {
    let { params } = this.props.navigation.state;
    let { navigate } = this.props.navigation;
    return (
      <View style={styles.section}>
        <Text style={{marginBottom:20}}>This number is printed on your agent's box and may contain letters. Please enter it as it is printed.</Text>
        {this.renderEnterSerialError()}
        <FormLabel>Serial Number:</FormLabel>
        <FormInput onChangeText={(text) => { this.state.tmp = text;} }/>
        <Button
          title="Submit"
          onPress={() => {
            this.state.s = this.state.tmp;
            /*Device.lookupSerial(this.state.s)
            .then((pass) => {
              // TODO: take this out when the contracts are set up on INFURAnet
              // pass = true
              if (!pass) {
                this.state.serial_error = true;
                navigate('LaunchScreen', this.state)
              } else {
                console.log('getting ether')
                return this.getEther()
                .then(() => { return this.claimDevice() })
                .then(() => { navigate('LaunchScreen') })
                .catch((err) => { console.log('err', err); this.state.tx_error = true; navigate('LaunchScreen', this.state) })
              }
            })*/
          }}
        />
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
    let { params } = this.props.navigation.state;
    /*if (!this.state.device_addr) {
      return this.renderSetupDevice()
    } else */
    if (params && params.serial_entered && !params.serial_error) {
      return;
    } else {
      console.log('rendering enter serial')
      return this.renderEnterSerial()
    }
  }

  render () {
    let { params } = this.props.navigation.state;
    if (params && params.device) { this.state.card_title = "Enter Serial Number" }
    else { this.state.card_title = "Please Setup Device"}
    return (
      <View style={styles.mainContainer}>
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
