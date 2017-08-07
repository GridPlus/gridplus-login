// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
import { Button, Card, Divider, FormLabel, FormInput } from 'react-native-elements'
// import LaunchScreen from '../LaunchScreen'
import RegisterDeviceScreen from './RegisterDeviceScreen'
let Keys = require('../Util/Keys.js')
let Fs = require('../Util/Fs.js')

// Styles
import styles from '../../Styles/LaunchScreenStyles'

//=====================================================
// RegisterScreen
//=====================================================
export default class RegisterScreen extends Component {

  state = {
    route: 'setup',
    m: null,                      // The mnemonic, will be stored to disc
    seed_written: false,          // True if the user says she has written the seed down
    double_check: false,          // True after double check
    enter_phrase: false,          // True if the user already has a phrase to enter
    phrase: ['','','','','','','','','','','',''],  // 12 word seed phrase
    phrase_matches: false,        // True if the user has entered a phrase and it is legit
    phrase_error: false,          // True if the user has entered a phrase and it was incorrect
  }

  componentDidMount() {
    let { navigation } = this.props;
    // Get a key (if one exists) and rerender
    Keys.getKey()
    .then((m) => {
      this.state.m = m;
    })
    .then(() => { this.forceUpdate() })
  }

  renderProceed() {
    if (!this.state.seed_written) {
      return (
        <Button onPress={() => {
          this.state.seed_written = true;
          this.forceUpdate();
        }}>
          I have written this down
        </Button>
      );
    } else if (!this.state.double_check) {
      return (
        <View style={{ 'marginTop': 30}}>
          <Text style={Styles.centerBoldText}>We're not kidding, you really need to write this down. We can't help you if you lose it.</Text>
          <Button onPress={() => { this.state.double_check = true; this.forceUpdate(); }}>
            I promise I have written it down
          </Button>
        </View>
      );
    } else {
      this.props.navigation.navigate('RegisterDevice');
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
        <Card title="Restore from Phrase">
          {this.renderEnterPhraseError()}
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
          <Button
            title="Submit"
            onPress={() => {
              let pass = Keys.checkPhrase(this.state.phrase);
              if (!pass) {

                this.state.phrase_error = true;
              } else {
                this.state.phrase_matches = true;
                this.state.mnemonic = this.state.phrase;
              }
              this.props.navigator.navigate('LaunchScreen', this.state);
            }}
          />
          <Button
            title="Back"
            style={{marginTop: 20}}
            onPress = {() => { this.state.enter_phrase = false; this.forceUpdate(); }}
          />
        </Card>
      </View>
    )
  }

  renderSetup() {
    let { navigation } = this.props;
    let { navigate } = navigation;
    let { params } = navigation.state;
    if (!this.state.m) {
      return (
        <View>
          <View style={styles.section} >
            <Card title="Welcome">
              <Text style={{textAlign: 'center'}}>
                Do you have a backup phrase already?
              </Text>
              <Button
                style={{marginTop: 50, marginBottom: 20 }}
                title="No, create one"
                onPress={() => {
                  Keys.generateKey()
                  .then((m) => {
                    this.state.m = m;
                    navigate('LaunchScreen', this.state)
                  })
                }}
              />
              <Button
                title="Yes"
                onPress={() => {
                  this.state.enter_phrase = true;
                  navigate('LaunchScreen', this.state);
                }}
              />
            </Card>
          </View>
        </View>
      )
    } else if (params.enter_phrase && params.phrase_matches == false) {
      return this.renderEnterPhrase()
    } else if (!params.enter_phrase && (!params.seed_written || !params.double_check)) {
      return this.renderBackupPhrase()
    } else {
      navigate('RegisterDevice')
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          {this.renderSetup()}
        </ScrollView>
      </View>
    )
  }
}
