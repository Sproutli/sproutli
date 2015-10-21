'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet
} = React;

var SearchBar = require('react-native-search-bar');
var COLOURS = require('../Constants/Colours');

class SearchBox extends React.Component {
  renderedSearchText() {
    if (!this.props.searchLabel || !this.props.showSearchText) { return <View />; }

    return (
      <Text style={styles.searchText}>
        <Text style={styles.bold}>{this.props.numberOfListings} {this.props.searchLabel} </Text> 
        around 
        <Text style={styles.bold}> {this.props.location}</Text> that are  
        <Text style={styles.bold}> {this.props.veganLevelText}</Text>
      </Text>
    );
  }

  render() {
    return (
      <View style={{marginTop: 4, marginBottom: 4, backgroundColor: 'white'}}>
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
         
         { this.renderedSearchText() }
       </View>
    );
  }
}

SearchBox.propTypes = {
  onSubmitEditing: React.PropTypes.func.isRequired,
  onChangeText: React.PropTypes.func.isRequired,

  searchLabel: React.PropTypes.string,
  location: React.PropTypes.string,
  veganLevelText: React.PropTypes.string,
  numberOfListings: React.PropTypes.number,
  showSearchText: React.PropTypes.bool,
  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func
};

var styles = StyleSheet.create({
  searchText: {
    paddingTop: 4,
    textAlign: 'center',
    color: COLOURS.GREY
  },

  bold: {
    fontWeight: 'bold'
  }
});

module.exports = SearchBox;
