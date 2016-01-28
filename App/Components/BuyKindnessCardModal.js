'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  PixelRatio,
  Animated,
  LinkingIOS,
  Platform,
  View
} = React;

var WebIntent = require('react-native-webintent');
var Button = require('./Button');
var COLOURS = require('../Constants/Colours');
var GoogleAnalytics = require('../Utils/GoogleAnalytics');
var Intercom = require('../Utils/Intercom');

var pixelRatio = PixelRatio.get();

class BuyKindnessCardModal extends React.Component {
  constructor() {
    super();

    this.state = {
      bounceValue: new Animated.Value(0),
      translateXValue: new Animated.Value(0)
    };
    GoogleAnalytics.viewedScreen('Buy Kindness Card');
  }

  _onGetKindnessCard() {
    GoogleAnalytics.trackEvent('Kindness Card', 'openLink');
    Intercom.logEvent('viewed_buy_kindness_card');
    const buyKindnessCardURL = 'http://www.sproutli.com/kindness-card.html';

    if (Platform.OS == 'ios') {
      LinkingIOS.openURL(buyKindnessCardURL);
    } else {
      WebIntent.open(buyKindnessCardURL);
    }
  }

  componentDidMount() {
    this.state.bounceValue.setValue(1.5);
    this.state.translateXValue.setValue(500.0);

    Animated.sequence([
      Animated.spring(
        this.state.bounceValue,
        {
          toValue: 1.0,
          tension: 300,
          friction: 2
        }
      ),
      Animated.spring(
        this.state.translateXValue,
        {
          toValue: 0.0,
          tension: 50
        }
      )
    ]).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.Text style={[styles.headerText, {transform: [{scale: this.state.bounceValue}]}]}>Get your Kindness card today.</Animated.Text>
        <Text style={styles.text}>The Sproutli Kindness Card provides you with discounts and deals for online and physical stores.</Text>
        <Text style={styles.text}>New deals are added every day, and it only costs $3.90 a month.</Text>

        <Text style={styles.text}>Interested? Get yours now!</Text>

        <Animated.View style={{alignItems: 'center', paddingTop: 20, transform: [{translateX: this.state.translateXValue}]}}>
          <Button color={COLOURS.GREY} onPress={this._onGetKindnessCard.bind(this)}>Get your kindness card</Button>
        </Animated.View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    color: 'white',
    fontSize: pixelRatio === 3 ? 20 : 15,
    fontWeight: '300',
    paddingVertical: 30
  },

  text: {
    fontSize: pixelRatio === 3 ? 15 : 10,
    color: 'white',
    paddingBottom: 20,
    textAlign: 'left'
  },

  container: {
    justifyContent: 'center',
    backgroundColor: COLOURS.GREEN,
    flex: 1,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowRadius: -5,
    shadowOpacity: 1.0
  }
});

module.exports = BuyKindnessCardModal;
