import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Components/LaunchScreen'
import SetupScreen from '../Components/Screens/SetupScreen'
import DevicesScreen from '../Components/Screens/DevicesScreen'
import RegisterDeviceScreen from '../Components/Screens/RegisterDeviceScreen'

import styles from '../Styles/NavigationStyles'

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
