'use strict';

var React = require('react-native');
var {
  TextInput,
  StyleSheet,
  Text,
  View
} = React;

var SearchSuggestion = require('./SearchSuggestion');
var Search = require('./Search');
var SearchBox = require('./SearchBox');

var SUGGESTIONS = require('../Constants/Suggestions');

class SearchHome extends React.Component {
  constructor() {
    super();
    this.state = {
      query: ''
    };
  }

  _onPressSuggestion(label) {
    var route;
    if (SUGGESTIONS[label]) {
      route = {
        component: SearchHome,
        title: label,
        passProps: { suggestions: SUGGESTIONS[label] }
      };
    } else {
      route = {
        component: Search,
        title: 'Search',
        passProps: { preCanned: label }
      }
    }

    this.props.navigator.push(route);
  }

  _onSearch() {
    this.props.navigator.push({
      component: Search,
      title: 'Search',
      passProps: { query: this.state.query }
    });
  }

  _onChangeText(text) {
    this.setState({
      query: text
    });
  }

  render() {
    var searchSuggestions = this.props.suggestions.map( (suggestionText, index) => {
      return ( 
        <SearchSuggestion 
          label={suggestionText} 
          key={index} 
          handler={this._onPressSuggestion.bind(this, suggestionText)}/>
      );
    });

    return (
      <View style={styles.bigContainer}>
        <SearchBox onSubmitEditing={this._onSearch.bind(this)} onChangeText={this._onChangeText.bind(this)} />
        <View style={styles.container}>
          {searchSuggestions}
        </View>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 32
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

module.exports = SearchHome;
