/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var App = require('./App/Components/App');
var SUGGESTIONS = require('./App/Constants/Suggestions');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TabBarIOS,
  AsyncStorage
} = React;

class Sproutli extends React.Component {
  constructor() {
    super();
    AsyncStorage.getItem('token')
      .then((item) => this.setState({token: item}))
      .catch((error) => console.error('Something bad happened fetching the token', error));
  }
  render() {
    return <App />
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
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

AppRegistry.registerComponent('sproutli', () => Sproutli);
