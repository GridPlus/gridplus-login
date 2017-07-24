import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../Components/RoundedButton'
import { Images } from '../Themes'
import LoginScreen from './Login/LoginScreen'
// Styles
import styles from './Styles/LaunchScreenStyles'


// THIS IS DEPRECATED. It should redirect to the main "devscreens" page

export default class LaunchScreen extends Component {
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
