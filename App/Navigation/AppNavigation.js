import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import SetupScreen from '../Containers/Screens/SetupScreen'
import DevicesScreen from '../Containers/Screens/DevicesScreen'
import RegisterDeviceScreen from '../Containers/Screens/RegisterDeviceScreen'

import styles from './Styles/NavigationStyles'

let init_route = 'LaunchScreen';

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: { screen: LaunchScreen },
  Devices: { screen: DevicesScreen },
  Setup: { screen: SetupScreen },
  RegisterDevice: { screen: RegisterDeviceScreen },
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: init_route,
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
