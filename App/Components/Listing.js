'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  PixelRatio,
  View
} = React;

var Icon = require('react-native-vector-icons/Ionicons');
var COLOURS = require('../Constants/Colours');
var VEGAN_LEVELS = require('../Constants/VeganLevels');
var pixelRatio = PixelRatio.get();

class Listing extends React.Component {
  renderedVeganLevel() {
    if (!this.props.listing.vegan_level) { return <View />; }
    return <Text style={styles.subTitle}><Icon style={styles.subTitle} name='ios-nutrition' /> {VEGAN_LEVELS[this.props.listing.vegan_level].short}</Text>;
  }

  renderedLocation() {
    var distance = this.props.listing.distance;
    if (!distance) { return <View />; }

    distance = parseFloat(distance).toFixed(1);

    return <Text style={styles.subTitle}><Icon style={styles.subTitle} name='location' />  {this.props.listing.locality} ({distance} km)</Text>;
  }

  renderedRating() {
    var rating = this.props.listing.rating;
    if (!rating) { 
      rating = 'No rating yet'; 
    } else {
      rating = `${rating}/5.0`;
    }

    return <Text style={styles.subTitle}><Icon style={styles.subTitle} name='ios-star' /> {rating}</Text>;
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
      <TouchableHighlight style={styles.card} onPress={this.props.handler} underlayColor={COLOURS.DARKER_GREEN}>
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
    borderRadius: 3,
    borderWidth: 0.1,
    borderColor: COLOURS.GREY,
    paddingVertical: 6 * PixelRatio.get(),
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    fontSize: pixelRatio * 9, 
    textAlign: 'left',
    color: 'white',
    fontWeight: '200'
  },
  subTitle: {
    fontSize: pixelRatio === 3 ? 18 : 14,
    color: 'white',
    fontWeight: '300'
  },
  tags: {
    fontSize: pixelRatio === 3 ? 15 : 12,
    fontStyle: 'italic',
    color: 'white',
    paddingTop: 20,
    fontWeight: '300'
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
