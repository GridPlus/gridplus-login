import { StyleSheet } from 'react-native'
import { Metrics } from './Metrics'
import { ApplicationStyles } from './ApplicationStyles'

export default StyleSheet.create({
   ...ApplicationStyles.screen,
  container: {
    paddingTop: Metrics.paddingTop,
    paddingBottom: Metrics.baseMargin
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  agent: {
    height: 200,
    width: 200,
  },
  centered: {
    alignItems: 'center'
  },
})
