'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  View
} = React;

class BuyKindnessCardModal extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>BUY A KINDNESS CARD.</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 64,
    flex: 1,
    padding: 10
  }
});

module.exports = BuyKindnessCardModal;
