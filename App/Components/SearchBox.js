'use strict';

var React = require('react-native');
var {
  View
} = React;

var SearchBar = require('react-native-search-bar');
var COLOURS = require('../Constants/Colours');

class SearchBox extends React.Component {
  render() {
    return (
      <View style={{marginTop: 4, marginBottom: 4, backgroundColor: 'white'}}>
        <SearchBar 
          text={this.props.query}
          barTintColour={COLOURS.GREEN}
          placeholder='Search'
          hideBackground
          textFieldBackgroundColor='#f8f8f8'
          tintColor={COLOURS.GREEN}
          onChangeText={this.props.onChangeText}
          onSearchButtonPress={this.props.onSubmitEditing}
          onFocus={this.props.onFocus}
         /> 
       </View>
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
