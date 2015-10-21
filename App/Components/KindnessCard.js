'use strict';

var React = require('react-native');
var KindnessCards = require('../Utils/KindnessCards');
var Users = require('../Utils/Users');
var BuyKindnessCardModal = require('./BuyKindnessCardModal');
var {
  StyleSheet,
  Text,
  ActivityIndicatorIOS,
  View
} = React;

var LinearGradient = require('react-native-linear-gradient');
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var Moment = require('moment');
var COLOURS = require('../Constants/Colours');

class KindnessCard extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      card: {}
    };
    KindnessCards.fetchCard()
      .then((card) => this.setState({ card: card[0] }))
      .catch((error) => console.warn(`[KindnessCard] - Error getting card - ${error}`));
    Users.fetchUser()
      .then((user) => this.setState({ user }))
      .catch((error) => console.warn(`[KindnessCard] - Error getting user - ${error}`));
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
          <Text style={styles.thanks}>Just a moment..</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <LinearGradient colors={[COLOURS.GREEN, COLOURS.BLUE]} style={styles.card}>
          <Text style={styles.title}>Kindness Card</Text>
          <View style={styles.detail}>
            <Text style={styles.text}>{this.state.user.name}</Text>
            <Text style={styles.text}>Expires: {this.nextPaymentDate()}</Text>
          </View>
        </LinearGradient>
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
    fontSize: 25,
    color: 'white',
    textAlign: 'left'
  },
  thanks: {
    paddingTop: 30,
    fontSize: 20,
    color: COLOURS.GREY
  },
  title: {
    flex: 1,
    fontSize: 30,
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
