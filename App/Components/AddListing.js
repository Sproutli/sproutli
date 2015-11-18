'use strict';

var React = require('react-native');
var {
  Text,
  View
} = React;

class AddListing extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Add your listing!</Text>
      </View>
    );
  }
}

module.exports = AddListing;
