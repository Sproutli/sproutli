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
  veganLevel() {
    if (!this.props.listing.vegan_level) { return ''; }
    return VEGAN_LEVELS[this.props.listing.vegan_level].short;
  }

  render() {
    return (
      <TouchableHighlight style={styles.card} onPress={this.props.handler}>
        <View>
          <Text style={styles.title}>{this.props.listing.name}</Text>
          <Text style={styles.subTitle}>{this.veganLevel()}</Text>
          <Text style={styles.subTitle}>{this.props.listing.distance}</Text>
          <Text style={styles.tags}>{this.props.listing.tags.join('#')}</Text>
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
    color: 'white'
  }
});

Listing.propTypes = {
  listing: React.PropTypes.object.isRequired,
  handler: React.PropTypes.func.isRequired
};

module.exports = Listing;
