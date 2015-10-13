'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  View
} = React;

class ListingDetail extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <Text>{this.props.listing.name} - except, detailed.</Text>
      </View>
    );
  }
}

ListingDetail.propTypes = {
  listing: React.PropTypes.object.isRequired
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 32
  },
});

module.exports = ListingDetail;
