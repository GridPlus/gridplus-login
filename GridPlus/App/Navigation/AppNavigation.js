import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import SetupScreen from '../Containers/Setup/SetupScreen'

import styles from './Styles/NavigationStyles'

let init_route = 'SetupScreen';

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: { screen: LaunchScreen },
  SetupScreen: { screen: SetupScreen },
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: init_route,
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
