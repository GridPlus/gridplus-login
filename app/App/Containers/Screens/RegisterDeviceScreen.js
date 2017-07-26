// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../Styles/Styles').Styles
import { ScrollView, Text, Image, View } from 'react-native'
import { Divider, FormLabel, FormInput } from 'react-native-elements'
import DevscreensButton from '../../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../../Components/RoundedButton'
import LaunchScreen from '../LaunchScreen'
import { Images } from '../../Themes'
let Device = require('../Util/Device.js')

// Styles
import styles from '../Styles/LaunchScreenStyles'

//=====================================================
// RegisterScreen
//=====================================================
export default class RegisterScreen extends Component {

  state = {
    s: null
  }

  componentDidMount() {
    // Get a key (if one exists) and rerender
    Device.getSerial()
    .then((s) => {
      console.log('s', s)
      this.state.s = s
    })
  }


  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View>
            <Text>Serial number</Text>
            {this.state.s}
          </View>
        </ScrollView>
      </View>
    )
  }
}
