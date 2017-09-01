// This screen will load if no wallet exists on the device.

import React, { Component } from 'react'
var Styles = require('../../Styles/Styles').Styles
import { Text, Image, View, StyleSheet } from 'react-native'
import { Card, Icon } from 'react-native-elements'
var Spinner = require('react-native-spinkit');
import { SmoothLine } from 'react-native-pathjs-charts'

// Local imports
var Api = require('../Util/Api.js');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
});

let data = [
    [{
      "x": 10,
      "y": 100
    }]
  ]

  let options = {
    width: 280,
    height: 280,
    color: '#2980B9',
    margin: {
      top: 20,
      left: 45,
      bottom: 25,
      right: 20
    },
    animate: {
      type: 'delayed',
      duration: 200
    },
    axisX: {
      showAxis: true,
      showLines: true,
      showLabels: true,
      showTicks: true,
      zeroAxis: false,
      orient: 'bottom',
      label: {
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: true,
        fill: '#34495E'
      }
    },
    axisY: {
      showAxis: true,
      showLines: true,
      showLabels: true,
      showTicks: true,
      zeroAxis: false,
      orient: 'left',
      label: {
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: true,
        fill: '#34495E'
      }
    }
  }

//=====================================================
// RegisterScreen
//=====================================================
export default class UsageScreen extends Component {

  constructor() {
    super()
  }

  componentDidMount() {
    let { jwt, devices } = this.props.data;
    console.log('this.state', this.state)
    if (!this.state || !this.state.bills) {
      this.setState({ bills: [] })
      console.log('set state', this.state)
      Api.getBills({ token: jwt, serial_hash: devices[0].serial_hash })
      .then((bills) => {
        console.log('got bills', bills)
        this.setState({ bills: bills })
        console.log('done with bills', this.state.bills)
      })
      .catch((err) => { console.log('error?', err); console.error('ERROR', err) })
    }
  }

  renderUsage() {
    if (!this.state || !this.state.bills) {
      return (
        <Card title="Loading...">
          <Spinner style={{marginTop: 100, marginBottom: 100, marginLeft: 60, marginRight: 60}} isVisible={true} size={150} type='Wave' color='#4990E2'/>
        </Card>
      );
    } else if (this.state.bills.length == 0) {
      return (
        <View>
          <Icon
  name='minus'
  size={200}
  type='evilicon'
  color='#9b9b9b'
/>
          <Text>You have no usage history. Once your agent is up and running, you can use this screen to view your usage history.</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <SmoothLine data={data} options={options} xKey='x' yKey='y' />
        </View>
  		);
    }
  }

  render () {
    return (
      <Card title="My Usage">
        {this.renderUsage()}
      </Card>
    )
  }
}
