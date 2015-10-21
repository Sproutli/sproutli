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
      <View style={{height: 56, backgroundColor: 'white'}}>
        <SearchBar 
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
  onBlur: React.PropTypes.func.isRequired,
  onFocus: React.PropTypes.func.isRequired,
  onChangeText: React.PropTypes.func.isRequired
};

module.exports = SearchBox;
