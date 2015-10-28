'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var {
  StyleSheet,
  NavigatorIOS,
  TabBarIOS
} = React;

var Search = require('./Search');
var Intercom = require('../Utils/Intercom');
var KindnessCard = require('./KindnessCard');
var SUGGESTIONS = require('../Constants/Suggestions');
var COLOURS = require('../Constants/Colours');

class App extends React.Component {
  constructor() {
    super();
    Intercom.userLoggedIn();
    this.state = {
      currentTab: 'food'
    };
  }

  makeNavigator(name) {
    return (
      <NavigatorIOS
        style={styles.container}
        tintColor={COLOURS.GREEN}
        titleTextColor={COLOURS.GREY}
        initialRoute={{
          component: Search,
          title: name,
          passProps: {searchConfig: SUGGESTIONS[name].searchConfig, searchLabel:name, veganLevel: this.veganLevel}
        }}
      />
    );
  }

  render() {
    return (
      <Search searchConfig={SUGGESTIONS['Food'].searchConfig} searchLabel="Food" veganLevel={4} />
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10
  }
});

module.exports = App;
