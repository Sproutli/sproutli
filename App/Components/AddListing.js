'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  Platform,
  View
} = React;

class AddListing extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Add your listing!</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 64 : 0,
    padding: 8
  }
});

module.exports = AddListing;
