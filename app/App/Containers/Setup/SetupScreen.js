// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../../Components/RoundedButton'
import { Images } from '../../Themes'
let crypto = require('crypto');
let bip39 = require('bip39')
let Promise = require('bluebird').Promise;
let ifs = require('react-native-fs');

// Styles
import styles from '../Styles/LaunchScreenStyles'

// Import this thing as a hack to get react-native-crypto to import :(
import '../../../shim.js'

// The default path for the keystore
const KEY_PATH = ifs.DocumentDirectoryPath + '/keystore'

//=====================================================
// RegisterScreen
//=====================================================
export default class RegisterScreen extends Component {

  state = {
    m: null     // The mnemonic
  }

  componentDidMount() {
    this.getKey()
    .then((exists) => {
      if (!exists) { return this.generateKey(); }
      else { return; }
    })
    .then(() => {
      this.forceUpdate()
    })
  }

  // Generate a mnemonic/key via BIP39
  generateKey() {
    // Get randomness from hashing all of the files in the bundle dir
    return ifs.readDir(ifs.MainBundlePath)
    .then((result) => {
      return Promise.map(result, (r) => {
        return this.hashFile(r)
      })
    })
    .then((stuff) => {
      // Concatenate, add timestamp, and hash it all
      let ts = new Date().getTime()
      stuff.push(ts.toString(16))
      let s = stuff.join("")
      let h = crypto.createHash('sha256').update(s).digest("hex")
      // Create BIP39 mnemonic
      this.state.m = bip39.entropyToMnemonic(h)
      // Save the mnemonic to the fs
      return ifs.writeFile(KEY_PATH, this.state.m, 'utf8')
    })
    .then((success) => { return; })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  }

  // Given a file system path, extract the data from a file and hash it
  hashFile(f) {
    return new Promise((resolve, reject) => {
      if (f.isFile()) {
        return ifs.hash(f.path, 'sha512')
        .then((data) => {
          resolve(data)
        })
        .catch((err) => { reject(err) })
      }
      else { resolve('0') }
    })
  }

  // See if a key exists
  getKey() {
    return new Promise((resolve, reject) => {
      ifs.readFile(KEY_PATH)
      .then((m) => {
        this.state.m = m;
        console.log('this.state.m', this.state.m)
        resolve(true);
      })
      .catch((err) => { resolve(false); })
    })
  }

  render () {
    console.log('this.state.m', this.state.m)
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.coloredLogo} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <Text style={styles.sectionText}>
              Your backup phrase
            </Text>
            <Text style={styles.sectionText}>
              {this.state.m}
            </Text>
          </View>

          <DevscreensButton/>
        </ScrollView>
      </View>
    )
  }
}
