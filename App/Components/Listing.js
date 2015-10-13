'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = React;

class Listing extends React.Component {
  render() {
    return (
      <TouchableHighlight style={styles.card} onPress={this.props.handler}>
        <View>
          <Text style={styles.title}>{this.props.listing.name}</Text>
          <Text style={styles.subTitle}>{this.props.listing.vegan_level}</Text>
          <Text style={styles.subTitle}>{this.props.listing.distance}</Text>
          <Text style={styles.tags}>{this.props.listing.tags.join('#')}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

var styles = {
  card: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'green',
    margin: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    fontSize: 25,
    textAlign: 'left',
    color: 'white',
  },
  subTitle: {
    fontSize: 20,
  },
  tags: {
    fontSize: 15,
    fontStyle: 'italic'
  },
  padding: {
  }
}

Listing.propTypes = {
  listing: React.PropTypes.object.isRequired
};

module.exports = Listing;
