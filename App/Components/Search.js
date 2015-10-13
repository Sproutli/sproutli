'use strict';

var React = require('react-native');
var SearchBox = require('./SearchBox');
var {
  TextInput,
  StyleSheet,
  Text,
  View
} = React;

class Search extends React.Component {
  render() {
    return (
      <View style={styles.bigContainer}>
        <SearchBox />
        <Text>{this.props.preCanned}</Text>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 32
  }
});

module.exports = Search;
