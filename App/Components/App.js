'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var SearchHome = require('./SearchHome');
var Feedback = require('./Feedback');
var KindnessCard = require('./KindnessCard');
var SUGGESTIONS = require('../Constants/Suggestions');
var {
  StyleSheet,
  NavigatorIOS,
  TabBarIOS
} = React;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentTab: 'home'
    };
  }

  render() {
    return (
      <TabBarIOS tintColor='green'>
        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'feedback'})}
          selected={this.state.currentTab === 'feedback'}
          iconName='thumbsup'
          title='Give Feedback'>

            <Feedback />

        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'home'})}
          selected={this.state.currentTab === 'home'}
          iconName={this.state.currentTab === 'home' ? 'ios-home' : 'ios-home-outline'}
          title='Home'>

          <NavigatorIOS
            style={styles.container}
            tintColor='green'
            initialRoute={{
              component: SearchHome,
              title: 'Home',
              passProps: {suggestions: SUGGESTIONS.initial}
            }}/>
            
        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'kindness_card'})}
          selected={this.state.currentTab === 'kindness_card'}
          iconName='card'
          title='Kindness Card'>

            <KindnessCard />
          
        </Icon.TabBarItem>
      </TabBarIOS>
    );
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
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

module.exports = App;
