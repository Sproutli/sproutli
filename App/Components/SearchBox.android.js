'use strict';

var React = require('react-native');
var {
  TextInput
} = React;

var COLOURS = require('../Constants/Colours');

class SearchBox extends React.Component {
  render() {
    return (
      <TextInput
        text={this.props.query}
        barTintColour={COLOURS.GREEN}
        placeholder='Search'
        hideBackground
        textFieldBackgroundColor='#f8f8f8'
        tintColor={COLOURS.GREEN}
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

module.exports = SearchBox;
