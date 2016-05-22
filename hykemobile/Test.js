import React, {
  AppRegistry,
  Component,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

class Test extends Component {
  componentDidMount() {
    console.log('mounted');
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Testing!</Text>
      </View>
    )
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

module.exports = Test;
