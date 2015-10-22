'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  LinkingIOS,
  Animated,
  View
} = React;

var Button = require('./Button');
var COLOURS = require('../Constants/Colours');

class BuyKindnessCardModal extends React.Component {
  constructor() {
    super();

    this.state = {
      bounceValue: new Animated.Value(0),
      translateXValue: new Animated.Value(0)
    };
  }

  _onGetKindnessCard() {
    LinkingIOS.openURL('http://www.sproutli.com/kindness-card.html');
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
    console.log(this.state.translateXValue);
    return (
      <View style={styles.container}>
        <Animated.Text style={[styles.headerText, {transform: [{scale: this.state.bounceValue}]}]}>Get your Kindness card today.</Animated.Text>
        <Text style={styles.text}>The Sproutli Kindness Card provides you with discounts and deals for online and physical stores.</Text>
        <Text style={styles.text}>New deals are added every day, and it only costs $4 a month.</Text>

        <Text style={styles.text}>Interested? Get yours now.</Text>

        <Animated.View style={{alignItems: 'center', paddingTop: 20, transform: [{translateX: this.state.translateXValue}]}}>
          <Button color='black' onPress={this._onGetKindnessCard.bind(this)}>Get your kindness card</Button>
        </Animated.View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    fontWeight: '300',
    paddingVertical: 30
  },

  text: {
    fontSize: 20,
    color: 'white',
    paddingBottom: 20,
    textAlign: 'left'
  },

  container: {
    justifyContent: 'center',
    backgroundColor: COLOURS.GREEN,
    marginTop: 64,
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
