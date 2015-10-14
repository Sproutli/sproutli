'use strict';

var React = require('react-native');
var SearchHome = require('./SearchHome');
var Feedback = require('./Feedback');
var SUGGESTIONS = require('../Constants/Suggestions');
var {
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TabBarIOS
} = React;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentTab: 'feedback'
    }
  }

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          onPress={() => this.setState({currentTab: 'feedback'})}
          selected={this.state.currentTab === 'feedback'}
          title="Give Feedback">
            <Feedback />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          onPress={() => this.setState({currentTab: 'home'})}
          selected={this.state.currentTab === 'home'}
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
}

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

module.exports = App;
