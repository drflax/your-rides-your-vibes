import React, {
  AppRegistry,
  Component,
  Image,
  ListView,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var HomeView = require('./HomeView');

class HykeMobile extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Hyke',
          component: HomeView,
        }}/>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('hykemobile', () => HykeMobile);

module.exports = HykeMobile;
