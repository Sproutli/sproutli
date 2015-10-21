'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = React;

var COLOURS = require('../Constants/Colours');
var VEGAN_LEVELS = require('../Constants/VeganLevels');

class Listing extends React.Component {
  renderedVeganLevel() {
    if (!this.props.listing.vegan_level) { return <View />; }
    return <Text style={styles.subTitle}>{VEGAN_LEVELS[this.props.listing.vegan_level].short}</Text>;
  }

  renderedLocation() {
    var distance = this.props.listing.distance;
    if (!distance) { return <View />; }

    distance = parseFloat(distance).toFixed(1);

    return <Text style={styles.subTitle}>{this.props.listing.locality} ({distance} km)</Text>;
  }

  renderedRating() {
    var rating = this.props.listing.rating;
    if (!rating) { 
      rating = 'No rating yet'; 
    } else {
      rating = `${rating}/5.0`;
    }

    return <Text style={styles.subTitle}>{rating}</Text>;
  }

  renderedTags() {
    var tags = this.props.listing.tags || [];
    return (
      <View style={styles.tagContainer}>
        { tags.map((tag, key) => <Text key={key} style={styles.tags}>#{tag.toLowerCase().replace(' ','')} </Text>) }
      </View>
    );
  }

  render() {
    return (
      <TouchableHighlight style={styles.card} onPress={this.props.handler}>
        <View>
          <Text style={styles.title}>{this.props.listing.name}</Text>

          { this.renderedVeganLevel() }
          { this.renderedRating() }
          { this.renderedLocation() }

          { this.renderedTags() }
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLOURS.GREEN,
    margin: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    fontSize: 30,
    textAlign: 'left',
    color: 'white',
    fontWeight: '300'
  },
  subTitle: {
    fontSize: 20,
    color: 'white'
  },
  tags: {
    fontSize: 15,
    fontStyle: 'italic',
    color: 'white',
    paddingTop: 20
  },
  tagContainer: {
    flexDirection: 'row'
  }
});

Listing.propTypes = {
  listing: React.PropTypes.object.isRequired,
  handler: React.PropTypes.func.isRequired
};

module.exports = Listing;
