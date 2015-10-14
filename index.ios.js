'use strict';

var React = require('react-native');
var App = require('./App/Components/App');
var Login = require('./App/Components/Login');
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
    this.state = { token:  undefined };
    AsyncStorage.getItem('token')
      .then((token) => this.setState({token}))
      .catch((error) => console.log('Something bad happened fetching the token', error));
  }

  render() {
    return this.props.token ? <App /> : <Login />
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
