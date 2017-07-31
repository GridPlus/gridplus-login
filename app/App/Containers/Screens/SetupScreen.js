// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
import { Divider, FormLabel, FormInput } from 'react-native-elements'
import DevscreensButton from '../../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../../Components/RoundedButton'
// import LaunchScreen from '../LaunchScreen'
import RegisterDeviceScreen from './RegisterDeviceScreen'
import { Images } from '../../Themes'
let Keys = require('../Util/Keys.js')

// Styles
import styles from '../Styles/LaunchScreenStyles'

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
    Keys.getKey()
    .then((m) => {
      this.state.m = m;
      this.forceUpdate()
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
          onPress={() => {
            let pass = Keys.checkPhrase(this.state.phrase);
            if (!pass) {
              this.state.phrase_error = true;
            } else {
              this.state.phrase_matches = true;
              this.state.mnemonic = this.state.phrase;
            }
            this.forceUpdate();}
          }
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
              onPress={() => { Keys.generateKey().then((m) => { this.state.m = m; this.forceUpdate(); }) } }
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
    } else if (!this.state.m && !this.state.enter_phrase && (!this.state.seed_written || !this.state.double_check)) {
      return this.renderBackupPhrase()
    } else {
      this.props.navigation.navigate('RegisterDevice');
      return;
      //return (<RegisterDeviceScreen/>);
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
