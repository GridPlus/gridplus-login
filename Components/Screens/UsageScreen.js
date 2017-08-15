// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../../Styles/Styles').Styles
import { Text, Image, View } from 'react-native'
import { Card } from 'react-native-elements'

//=====================================================
// RegisterScreen
//=====================================================
export default class UsageScreen extends Component {

  constructor() {
    super()
  }

  componentDidMount() {
  }

  renderUsage() {
    return (
      <Text>Usage coming soon</Text>
    )
  }

  render () {
    return (
      <Card title="My Usage">
        {this.renderUsage()}
      </Card>
    )
  }
}
