import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../../Components/RoundedButton'
import { Images } from '../../Themes'

// Styles
import styles from '../Styles/LaunchScreenStyles'

// This screen will load if no wallet exists on the device.

export default class LoginScreen extends Component {
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
              Please log in to Grid+
            </Text>
          </View>

          <DevscreensButton/>
        </ScrollView>
      </View>
    )
  }
}
