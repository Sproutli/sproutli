'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;

class KindnessCard extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> INCOMPREHENSIBLE MUMBLING </Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 40,
    textAlign: 'center'
  }
});

module.exports = KindnessCard;
