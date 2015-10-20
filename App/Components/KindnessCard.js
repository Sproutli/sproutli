'use strict';

var React = require('react-native');
var KindnessCards = require('../Utils/KindnessCards');
var {
  StyleSheet,
  Text,
  View
} = React;

class KindnessCard extends React.Component {
  constructor() {
    super();
    this.state = {
      card: {}
    };
    KindnessCards.fetchCard()
      .then((card) => this.setState({ card: card[0] }))
      .catch((error) => console.warn(`Error getting card ${error}`));
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> {this.state.card.start_date} </Text>
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
