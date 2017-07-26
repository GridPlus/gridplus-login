import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import ButtonBox from './Components/ButtonBox'
import RoundedButton from '../Components/RoundedButton'
import { Images } from '../Themes'
import SetupScreen from './Setup/SetupScreen'
import {Grid, Col} from 'react-native-elements';

// Styles
import styles from './Styles/LaunchScreenStyles'


// THIS IS DEPRECATED. It should redirect to the main "devscreens" page

export default class LaunchScreen extends Component {
  render () {
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
                <ButtonBox style={styles.apiButton} image={Images.api} text='Devices' />
                <ButtonBox image={Images.theme} text='Settings' />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
