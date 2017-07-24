import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/Login/LoginScreen'

import styles from './Styles/NavigationStyles'

let init_route = 'LoginScreen';

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: { screen: LaunchScreen },
  LoginScreen: { screen: LoginScreen },
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: init_route,
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
