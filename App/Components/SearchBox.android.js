'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TextInput
} = React;

var COLOURS = require('../Constants/Colours');

class SearchBox extends React.Component {
  render() {
    return (
      <TextInput
        style={styles.search}
        text={this.props.query}
        placeholder='Search'
        underlineColorAndroid={COLOURS.GREEN}
        onChangeText={this.props.onChangeText}
        onSubmitEditing={this.props.onSubmitEditing}
        onFocus={this.props.onFocus}
       /> 
    );
  }
}

SearchBox.propTypes = {
  onSubmitEditing: React.PropTypes.func.isRequired,
  onChangeText: React.PropTypes.func.isRequired,

  searchLabel: React.PropTypes.string,
  veganLevelText: React.PropTypes.string,
  numberOfListings: React.PropTypes.number,
  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  query: React.PropTypes.string
};

var styles = StyleSheet.create({
  search: {
    height: 44,
    marginHorizontal: 4
  }
});

module.exports = SearchBox;
