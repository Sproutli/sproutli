'use strict';

import React from 'react';
import {
  View,
  AppRegistry,
  Navigator,
  AsyncStorage
} from 'react-native';

const App = require('./App/Components/App');
const Login = require('./App/Components/Login');

class Sproutli extends React.Component {
  constructor() {
    super();
    this.state = { token:  undefined };
    AsyncStorage.getItem('token')
      .then((token) => {
        this.setState({token});
      })
      .catch((error) => console.warn('[SproutliMain] - Something bad happened fetching the token', error));
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

AppRegistry.registerComponent('sproutli', () => Sproutli);
