'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;

class SearchHome extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.welcome}>Food</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.welcome}>Products</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.welcome}>Services</Text>
        </View>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = SearchHome;
