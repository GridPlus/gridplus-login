// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../../Components/RoundedButton'
import { Images } from '../../Themes'
//import bip39 from 'react-native-bip39'
let bip39 = require('bip39')
let Promise = require('bluebird').Promise;
let ifs = require('react-native-fs');


// Styles
import styles from '../Styles/LaunchScreenStyles'


// Import this thing as a hack to get react-native-crypto to import :(
import '../../../shim.js'

// The default path for the keystore
const KEY_PATH = ifs.DocumentDirectoryPath + '/keystore'

export default class RegisterScreen extends Component {

  componentDidMount() {
    this.generateKey()
  }

  generateKey() {
    // Get randomness from hashing all of the files in the bundle dir
    return ifs.readDir(ifs.MainBundlePath)
    .then((result) => {
      return Promise.map(result, (r) => {
        return this.hashFile(r)
      })
    })
    .then((stuff) => {
      let ts = new Date().getTime()
      stuff.push(ts.toString(16))
      console.log(stuff)
      let s = stuff.join("")
      console.log(s)
      //const mnemonic = bip39.entropyToMnemonic(s)
      //console.log('mnemonic', mnemonic)
    })
    // .then((contents) => {
    //   // log the file contents
    //   console.log(contents);
    // })
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

  getKey() {
    ifs.writeFile(KEY_PATH, 'some text YAaaaaaaay', 'utf8')
    .then((success) => {
      return ifs.readFile(path)
    })
    .then((data) => {
    })
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.coloredLogo} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <Text style={styles.sectionText}>
              Please log in to Grid+ hello
            </Text>
          </View>

          <DevscreensButton/>
        </ScrollView>
      </View>
    )
  }
}
