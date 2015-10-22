'use strict';

var React = require('react-native');
var App = require('./App/Components/App');
var Login = require('./App/Components/Login');
var {
  View,
  AppRegistry,
  Navigator,
  AsyncStorage
} = React;

class Sproutli extends React.Component {
  constructor() {
    super();
    this.state = { token:  undefined };
    AsyncStorage.getItem('token')
      .then((token) => {
        this.setState({token});
      })
      .catch((error) => console.log('Something bad happened fetching the token', error));
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
