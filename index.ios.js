/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var SearchHome = require('./App/Components/SearchHome');
var SUGGESTIONS = require('./App/Constants/Suggestions');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
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

          <NavigatorIOS
            style={styles.container}
            initialRoute={{
              component: SearchHome,
              title: 'Home',
              passProps: {suggestions: SUGGESTIONS.initial}
            }}/>
            
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
