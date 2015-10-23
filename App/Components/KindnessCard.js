'use strict';

var React = require('react-native');
var KindnessCards = require('../Utils/KindnessCards');
var Users = require('../Utils/Users');
var BuyKindnessCardModal = require('./BuyKindnessCardModal');
var {
  StyleSheet,
  Text,
  ActivityIndicatorIOS,
  Animated,
  PixelRatio,
  View
} = React;

var LinearGradient = require('react-native-linear-gradient');
var Dimensions = require('Dimensions');
var Moment = require('moment');

var COLOURS = require('../Constants/Colours');

var GoogleAnalytics = require('../Utils/GoogleAnalytics');

var {height, width} = Dimensions.get('window');
var pixelRatio = PixelRatio.get();

class KindnessCard extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      bounceValue: new Animated.Value(0),
      card: {}
    };
    KindnessCards.fetchCard()
      .then((card) => this.setState({ card: card[0] }, this.bounceCard))
      .catch((error) => console.warn(`[KindnessCard] - Error getting card - ${error}`));
    Users.fetchUser()
      .then((user) => this.setState({ user }))
      .catch((error) => console.warn(`[KindnessCard] - Error getting user - ${error}`));

    GoogleAnalytics.viewedScreen('Kindness Card');
  }

  bounceCard() {
    this.state.bounceValue.setValue(1.5);
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: 1.0,
        friction: 1
      }
    ).start();
  }

  nextPaymentDate() {
    if (!this.state.card.start_date) { return ''; }

    var startDate = Moment(this.state.card.start_date),
      interval = this.state.card.membership_type,
      timeToAdd = interval.split('ly')[0], // hee heee
      nextPayment = startDate.add(1, timeToAdd);

    return nextPayment.format('DD/MM/YYYY');
  }

  render() {
    if (this.state.card === undefined) {
      return <BuyKindnessCardModal />;
    }

    if (!this.state.card.start_date) {
      return (
        <View style={styles.container}>
          <ActivityIndicatorIOS size='large' />
          <Text style={styles.loadingText}>Just a moment..</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Animated.View style={{transform: [{scale: this.state.bounceValue}]}}>
          <LinearGradient colors={[COLOURS.GREEN, COLOURS.BLUE]} style={styles.card}>
            <Text style={styles.title}>Kindness Card</Text>
            <View style={styles.detail}>
              <Text style={styles.text}>{this.state.user.name}</Text>
              <Text style={styles.text}>Expires: {this.nextPaymentDate()}</Text>
            </View>
          </LinearGradient>
        </Animated.View>
        <Text style={styles.thanks}>You are a great person and Sproutli loves you.</Text>
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
    fontSize: pixelRatio === 3 ? 25 : 17,
    color: 'white',
    textAlign: 'left'
  },
  thanks: {
    paddingTop: 30,
    fontSize: 20,
    color: COLOURS.GREY
  },
  loadingText: {
    paddingTop: 30,
    fontSize: PixelRatio.get() === 3 ? 20 : 12,
    color: COLOURS.GREY
  },
  title: {
    flex: 1,
    fontSize: pixelRatio * 10,
    width: width - 60,
    color: 'white',
    textAlign: 'right'
  },
  card: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: width - 20,
    height: height / 3
  }
});

module.exports = KindnessCard;
