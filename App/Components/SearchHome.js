'use strict';

var React = require('react-native');
var SearchSuggestion = require('./SearchSuggestion');
var SUGGESTIONS = require('../Constants/Suggestions');
var {
  TextInput,
  StyleSheet,
  Text,
  View
} = React;

class SearchHome extends React.Component {
  constructor() {
    super();
    this.state = {
      suggestions: SUGGESTIONS.initial
    };
  }

  _onPressSuggestion(label) {
    if (SUGGESTIONS[label]) {
      this.setState({
        suggestions: SUGGESTIONS[label]
      });
    } else {
      // Navigate Away
    }
  }

  render() {
    var searchSuggestions = this.state.suggestions.map( (suggestionText, index) => {
      return ( 
        <SearchSuggestion 
          label={suggestionText} 
          key={index} 
          handler={this._onPressSuggestion.bind(this, suggestionText)}/>
      );
    });

    return (
      <View style={styles.container}>
        <TextInput 
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          value="Search for something"
         /> 
        <View style={styles.container}>
          {searchSuggestions}
        </View>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

module.exports = SearchHome;
