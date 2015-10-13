/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var SearchHome = require('./App/Components/SearchHome');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS
} = React;

var sproutli = React.createClass({
  render: function() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          title="Give Feedback">
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={true}
          title="Home">
          <SearchHome></SearchHome>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Kindness Card">
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
});

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

AppRegistry.registerComponent('sproutli', () => sproutli);
