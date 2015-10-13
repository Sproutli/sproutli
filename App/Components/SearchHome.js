'use strict';

var React = require('react-native');
var SearchSuggestion = require('./SearchSuggestion');
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
      suggestions: ['Food', 'Products', 'Services']
    };
  }

  render() {
    var searchSuggestions = this.state.suggestions.map( (suggestionText, index) => <SearchSuggestion label={suggestionText} key={index} /> );

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
