'use strict';

import React, {
  AppRegistry,
  Component,
  Navigator,
  StyleSheet,
  AsyncStorage,
  Text,
  View
} from 'react-native';
var App = require('./App/Components/App');
var Login = require('./App/Components/Login');
var GoogleAnalytics = require('./App/Utils/GoogleAnalytics');

class Sproutli extends React.Component {
  constructor() {
    super();
    this.state = { token:  undefined };
    AsyncStorage.getItem('token')
      .then((token) => {
        this.setState({token});
      })
      .catch((error) => {
        console.warn('[SproutliMain] - Something bad happened fetching the token', error);
        GoogleAnalytics.trackError(error, true);
      });
  }

  renderScene(route, navigator) {
    switch(route.name) {
    case 'app':
      return <App token={this.state.token} />;
    case 'login':
      return <Login navigator={navigator} signingUp={route.signingUp} email={route.email} password={route.password} />;
    }
  }


  render() {
    // Render a blank view while we wait for our token.
    if (this.state.token === undefined) {
      return <View />;
    }

    return (
      <Navigator
        initialRoute={{name: this.state.token ? 'app' : 'login', index: 0}}
        renderScene={this.renderScene.bind(this)}      
      />
    );
  }
}

console.log('AppRegistry is a face.');

AppRegistry.registerComponent('sproutli', () => Sproutli);
