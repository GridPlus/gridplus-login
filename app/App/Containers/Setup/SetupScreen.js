// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
import { Divider, FormLabel, FormInput } from 'react-native-elements'
import DevscreensButton from '../../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../../Components/RoundedButton'
import { Images } from '../../Themes'
let crypto = require('crypto');
let bip39 = require('bip39')
let Promise = require('bluebird').Promise;
let ifs = require('react-native-fs');
let wordlist = require('./bip_39_words.json');

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
    m: null,                      // The mnemonic, will be stored to disc
    seed_written: false,          // True if the user says she has written the seed down
    double_check: false,          // True after double check
    enter_phrase: false,          // True if the user already has a phrase to enter
    phrase: ['','','','','','','','','','','',''],  // 12 word seed phrase
    phrase_matches: false,        // True if the user has entered a phrase and it is legit
    phrase_error: false,          // True if the user has entered a phrase and it was incorrect
  }

  componentDidMount() {
    // Get a key (if one exists) and rerender
    // this.getKey()
    // this.generateKey()
    // .then(() => { return this.getKey() })
    // .then((exists) => {
    //   this.forceUpdate()
    // })
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
      // Slice the hash to drop seed phrase size from 24 -> 12
      this.state.m = bip39.entropyToMnemonic(h.substr(0,32))
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
        resolve(true);
      })
      .catch((err) => { resolve(false); })
    })
  }


  renderProceed() {
    if (!this.state.seed_written) {
      return (
        <RoundedButton onPress={() => {
          this.state.seed_written = true;
          this.forceUpdate();
        }}>
          I have written this down
        </RoundedButton>
      );
    } else if (!this.state.double_check) {
      return (
        <View style={{ 'marginTop': 30}}>
          <Text style={Styles.centerBoldText}>We're not kidding, you really need to write this down. We can't help you if you lose it.</Text>
          <RoundedButton onPress={() => { this.state.double_check = true; this.forceUpdate(); }}>
            I promise I have written it down
          </RoundedButton>
        </View>
      );
    } else {
      return;
    }
  }

  renderBackupPhrase() {
    return (
      <View >
        <Text style={Styles.titleText}>
          Your secret backup phrase
        </Text>
        <View style={{'marginTop': 50, 'backgroundColor': '#1a1a1a', 'marginRight': 10, 'marginLeft': 10, 'borderRadius': 10}}>
          <Text style={styles.sectionText}>
            {this.state.m}
          </Text>
        </View>
        <View style={{'marginTop': 50}}/>

        <Divider/>
        <View style={{'marginTop': 50}}/>

        <Text style={Styles.centerBoldText}>
          YOU MUST WRITE THIS DOWN!
        </Text>
        <Text style={Styles.centerText}>
          Keep it secret, keep it safe, and don't lose it. If you lose this, we can't recover it for you!
        </Text>
        <View style={{'marginTop': 50}}/>
        {this.renderProceed()}
      </View>
    );
  }

  // Check a user-entered phrase against a wordlist. If any
  checkPhrase() {
    let bad_word = false;
    for (let i=0; i<this.state.phrase.length; i++) {
      // lowercase and strip whitespace
      let word = this.state.phrase[i].toLowerCase().replace(/ /g,'');
      // Make sure all words match the wordlist
      if (wordlist.words.indexOf(this.state.phrase[i]) == -1) {
        bad_word = true;
      }
    }
    if (!bad_word) {
      this.state.phrase_matches = true;
      this.state.mnemonic = this.state.phrase;
    } else {
      this.state.phrase_error = true;
    }
  }

  renderEnterPhraseError() {
    if (this.state.phrase_error) {
      return (
        <Text style={Styles.errorText}>
          Error: One or more of your words is incorrect. Please double check your phrase and enter words one per line.
        </Text>)
    } else {
      return(<Text/>);
    }
  }

  renderEnterPhrase() {
    return (
      <View style={styles.section}>
        {this.renderEnterPhraseError()}
        <Text style={Styles.titleText}>Restore From Phrase</Text>
        <FormLabel>Please enter the phrase you have previously generated:</FormLabel>
        <FormInput onChangeText={(text) => { this.state.phrase[0] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[1] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[2] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[3] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[4] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[5] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[6] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[7] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[8] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[9] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[10] = text;} }/>
        <FormInput onChangeText={(text) => { this.state.phrase[11] = text;} }/>
        <RoundedButton
          onPress={() => {this.checkPhrase(); this.forceUpdate();} }
        >
          Submit
        </RoundedButton>
        <RoundedButton onPress = {() => { this.state.enter_phrase = false; this.forceUpdate(); }}>
          Back
        </RoundedButton>
      </View>
    )
  }

  renderSetup() {
    if (!this.state.m && !this.state.enter_phrase) {
      return (
        <View>
          <View style={styles.centered}>
            <Image source={Images.coloredLogo} style={styles.logo} />
          </View>
          <View style={styles.section} >
            <Text style={Styles.titleText}>
              Welcome.
            </Text>
            <Text style={styles.sectionText}>
              Do you have a backup phrase already?
            </Text>
            <RoundedButton
              onPress={() => { this.generateKey().then(() => { this.forceUpdate(); }) } }
            >
              No, create one
            </RoundedButton>
            <RoundedButton
              onPress={() => {this.state.enter_phrase = true; this.forceUpdate();} }
            >
              Yes
            </RoundedButton>
          </View>
        </View>
      )
    } else if (this.state.enter_phrase && this.state.phrase_matches == false) {
      return this.renderEnterPhrase()
    } else {
      return this.renderBackupPhrase()
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          {this.renderSetup()}
        </ScrollView>
      </View>
    )
  }
}
