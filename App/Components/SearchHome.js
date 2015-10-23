'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View
} = React;

var SearchSuggestion = require('./SearchSuggestion');
var Search = require('./Search');
var SearchBox = require('./SearchBox');

var Intercom = require('../Utils/Intercom');

var SUGGESTIONS = require('../Constants/Suggestions');

class SearchHome extends React.Component {
  constructor() {
    super();
    this.state = {
      query: ''
    };

    Intercom.userLoggedIn();
  }

  _onPressSuggestion(suggestion) {
    var route;
    var label = suggestion.label;

    if (SUGGESTIONS[label]) {
      route = {
        component: SearchHome,
        title: label,
        passProps: { suggestions: SUGGESTIONS[label] }
      };
    } else {
      route = {
        component: Search,
        title: label,
        passProps: { searchLabel: label, searchConfig: suggestion.searchConfig }
      };
    }

    this.props.navigator.push(route);
  }

  _onSearch() {
    this.props.navigator.push({
      component: Search,
      title: 'Search',
      passProps: { query: this.state.query, searchConfig: SUGGESTIONS.initialConfig, searchLabel: this.state.query }
    });
  }

  _onChangeText(text) {
    this.setState({
      query: text
    });
  }

  render() {
    var searchSuggestions = this.props.suggestions.map( (suggestion, index) => {
      return ( 
        <SearchSuggestion 
          label={suggestion.label} 
          icon={suggestion.icon}
          key={index} 
          handler={this._onPressSuggestion.bind(this, suggestion)}/>
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
}

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
    backgroundColor: '#fff'
  }
});

SearchHome.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  suggestions: React.PropTypes.array.isRequired
};

module.exports = SearchHome;
