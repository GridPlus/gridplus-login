// This is the main landing screen for users who have already set up their keys

import React, { Component } from 'react'
import { ScrollView, Text, Image, View, TouchableOpacity } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import ButtonBox from './Components/ButtonBox'
import RoundedButton from '../Components/RoundedButton'
import { Images } from '../Themes'
import SetupScreen from './Screens/SetupScreen'
import RegisterDeviceScreen from './Screens/RegisterDeviceScreen'
// import DevicesScreen from './Screens/DevicesScreen.js'

import PrimaryNav from '../Navigation/AppNavigation.js'
var Keys = require('./Util/Keys.js');
var Device = require('./Util/Device.js');

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {

  state = {
    m: null,
    s: null,
    navigate: null,
  }

  componentDidMount() {
    const { navigate } = this.props.navigation;
    this.state.navigate = navigate;
    console.log('navigate', navigate)
    Keys.getKey()
    .then((key) => {
      this.state.m = key;
      return Device.getSerial()
    })
    .then((serial) => {
      this.state.s = serial;
      if (!this.state.m) { this.state.navigate('Setup'); }
      else if (!this.state.s) { this.state.navigate('RegisterDevice')}
    })
  }

  render () {
    this.state.navigate = this.props.navigation.navigate;
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionText}>
              Welcome to your Grid+ Portal
            </Text>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View>
                <ButtonBox style={styles.componentButton} image={Images.components} text='Usage' />
                <ButtonBox style={styles.usageButton} image={Images.usageExamples} text='Account' />
              </View>
              <View>
                <ButtonBox onPress={()=>{this.state.navigate('Devices')}} style={styles.apiButton} image={Images.api} text='Devices' />
                <ButtonBox image={Images.theme} text='Settings' />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
