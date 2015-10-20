'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  View
} = React;

class OfferModal extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.offerDetails}</Text>
        <Text>{this.props.offerConditions}</Text>
        <Text>{this.props.offerInstructions}</Text>
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

OfferModal.propTypes = {
  offerDetails: React.PropTypes.string.isRequired,
  offerConditions: React.PropTypes.string.isRequired,
  offerInstructions: React.PropTypes.string.isRequired
};

module.exports = OfferModal;
