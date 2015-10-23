'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  PixelRatio,
  View
} = React;

var Icon = require('react-native-vector-icons/Ionicons');
var COLOURS = require('../Constants/Colours');
var Intercom = require('../Utils/Intercom');
var GoogleAnalytics = require('../Utils/GoogleAnalytics');

class OfferModal extends React.Component {
  constructor() {
    super();

    this.state = {
      cardIcon: { uri: null}
    };

    Intercom.logEvent('viewed_offer');
    GoogleAnalytics.trackEvent('Kindness Card', 'viewOffer');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Icon color='white' name='card' size={150} />
          <Text style={styles.headerText}>Claim your offer!</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={[styles.detailsText, styles.bold]}>What&apos;s the offer?</Text>
          <Text style={styles.detailsText}>{this.props.offerDetails}</Text>

          <Text style={[styles.detailsText, styles.bold]}>How do you get it?</Text>
          <Text style={styles.detailsText}>{this.props.offerInstructions}</Text>

          <Text style={[styles.detailsText, styles.bold]}>Any conditions?</Text>
          <Text style={styles.detailsText}>{this.props.offerConditions}</Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 64,
    flex: 1
  },

  headerText: {
    color: 'white',
    fontSize: PixelRatio.get() === 3 ? 30 : 22
  },

  detailsText: {
    color: COLOURS.GREY,
    fontSize: PixelRatio.get() === 3 ? 17 : 13,
    paddingBottom: 17
  },

  bold: {
    paddingBottom: 0,
    fontWeight: 'bold'
  },

  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLOURS.GREEN
  },

  detailsContainer: {
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
