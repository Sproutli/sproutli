'use strict';

var React = require('react-native');
var {
  StyleSheet,
  NavigatorIOS,
  TabBarIOS
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

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

    Icon.getImageSource('plus', 24, COLOURS.GREEN).then((source) => {
      console.log('Hell yeah:', source);
      this.setState({ addIcon: source });
    });
  }

  makeNavigator(name) {
    if (!this.state.addIcon) { return false; }

    return (
      <NavigatorIOS
        style={styles.container}
        tintColor={COLOURS.GREEN}
        titleTextColor={COLOURS.GREY}
        initialRoute={{
          rightButtonIcon: this.state.addIcon,
          component: Search,
          title: name,
          passProps: {searchConfig: SUGGESTIONS[name].searchConfig, searchLabel:name, veganLevel: this.veganLevel},
          onRightButtonPress: () => { console.log('Hey there!'); }
        }}
      />
    );
  }


  render() {
    return (
      <TabBarIOS tintColor={COLOURS.GREEN}>
        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'food'})}
          selected={this.state.currentTab === 'food'}
          iconName='fork'
          title='Food'>
          { this.makeNavigator('Food') }
        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'shops'})}
          selected={this.state.currentTab === 'shops'}
          iconName='bag'
          title='Shops'>
          { this.makeNavigator('Shops') }
        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'services'})}
          selected={this.state.currentTab === 'services'}
          iconName='ios-people'
          title='Services'>
          { this.makeNavigator('Services') }
        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'online'})}
          selected={this.state.currentTab === 'online'}
          iconName='earth'
          title='Online'>
          { this.makeNavigator('Online') }
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
  }
});

module.exports = App;
