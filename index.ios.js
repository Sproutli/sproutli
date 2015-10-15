'use strict';

var React = require('react-native');
var App = require('./App/Components/App');
var Login = require('./App/Components/Login');
var SUGGESTIONS = require('./App/Constants/Suggestions');
var {
  AppRegistry,
  Navigator,
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
    return (
      <Navigator
        initialRoute={{name: !this.state.token ? 'login' : 'app', index: 0}}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case 'app':
              return <App token={this.state.token} /> 
            case 'login': 
              console.log(route.signingUp);
              return <Login navigator={navigator} signingUp={route.signingUp} />
          }
        }}
      />
    )
  }
};

AppRegistry.registerComponent('sproutli', () => Sproutli);
