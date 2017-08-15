import { Alert } from 'react-native';

// Alert button
exports.alert = function(title, msg, buttons) {
  if (!buttons) { buttons = [{ text: 'Ok' }] }
  console.log('msg', msg)
  Alert.alert(
    title || 'Error',
    msg || 'An error occured',
    buttons,
    { cancelable: false }
  )
}
