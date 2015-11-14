'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableOpacity,
  PixelRatio,
  Image,
  View
} = React;

// var Icon = require('react-native-vector-icons/Ionicons');
var COLOURS = require('../Constants/Colours');
var VEGAN_LEVELS = require('../Constants/VeganLevels');

var pixelRatio = PixelRatio.get();

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
    var listing = (
      <View>
        <Text style={styles.title}>{this.props.listing.name}</Text>

        { this.renderedVeganLevel() }
        { this.renderedRating() }
        { this.renderedLocation() }

        { this.renderedTags() }
      </View>
    );

    if (this.props.listing.premium && this.props.listing.cover_image) {
      return (
        <TouchableOpacity onPress={this.props.handler} activeOpacity={0.8}> 
          <Image style={styles.card} source={{uri: this.props.listing.cover_image}}>
            { listing }
          </Image>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={[styles.card, {backgroundColor: COLOURS.GREEN }]} onPress={this.props.handler} activeOpacity={0.8}> 
        { listing }
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    margin: 10,
    borderRadius: 3,
    borderWidth: 0.1,
    borderColor: COLOURS.GREY,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white',
    fontWeight: '200'
  },
  subTitle: {
    fontSize: 13,
    color: 'white',
    fontWeight: '300'
  },
  tags: {
    fontSize: pixelRatio === 3 ? 15 : 10,
    fontStyle: 'italic',
    color: 'white',
    paddingTop: 20,
    fontWeight: '200'
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
