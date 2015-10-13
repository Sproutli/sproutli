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
  render() {
    return (
      <View style={styles.container}>
        <TextInput 
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          value="Search for something"
         /> 
        <View style={styles.container}>
          <SearchSuggestion label="Food" />
          <SearchSuggestion label="Products" />
          <SearchSuggestion label="Services" />
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
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = SearchHome;
