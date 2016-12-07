'use strict';

import React from 'react';
import {
  StyleSheet,
  NavigatorIOS,
  Linking,
  View,
  TabBarIOS,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var AddListing = require('./AddListing');
var Search = require('./Search');
var Intercom = require('../Utils/Intercom');
var ListingFetcher = require('../Utils/ListingFetcher');
var ListingDetail = require('./ListingDetail');
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
      this.setState({ addIcon: source });
    });

    Linking.addEventListener('url', this._handleOpenURL.bind(this));

    Linking.getInitialURL().then(u => this._handleOpenURL({url: u}));
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL.bind(this));
  }

  _handleOpenURL(event) {
    console.log('Got incoming eventURL:', event.url);
    if (typeof(event.url) !== 'string') {
      return;
    }

    var URI = decodeURIComponent(event.url);
    var appLinkData = JSON.parse(URI.split('al_applink_data=')[1]);

    var targetURL = appLinkData.target_url;
    var listingID = targetURL.split('listingID=')[1].split('&')[0];

    ListingFetcher.fetch(listingID)
    .then((listing) => {
      console.log('Got listing!', listing);
      this.refs.navigator.push({
        component: ListingDetail,
        passProps: { listing },
        title: listing.name
      });
    })
    .catch((error) => {
      console.warn('Error fetching listing:', error);
    });
  }

  showIntercomMessenger() {
    Intercom.displayMessageComposer();
  }

  makeNavigator(name) {
    if (!this.state.addIcon) { return false; }

    return (
      <NavigatorIOS
        style={styles.container}
        tintColor={COLOURS.GREEN}
        titleTextColor={COLOURS.GREY}
        ref='navigator'
        initialRoute={{
          rightButtonIcon: this.state.addIcon,
          component: Search,
          title: name,
          passProps: {searchConfig: SUGGESTIONS[name].searchConfig, searchLabel:name, veganLevel: this.veganLevel, showSearch: true},
          onRightButtonPress: () => { this.refs.navigator.push({
            component: AddListing,
            title: 'Add a Listing'
          }); }
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
          iconName='cutlery'
          title='Food'>
          { this.makeNavigator('Food') }
        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'shops'})}
          selected={this.state.currentTab === 'shops'}
          iconName='shopping-bag'
          title='Shops'>
          { this.makeNavigator('Shops') }
        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'services'})}
          selected={this.state.currentTab === 'services'}
          iconName='users'
          title='Services'>
          { this.makeNavigator('Services') }
        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'online'})}
          selected={this.state.currentTab === 'online'}
          iconName='globe'
          title='Online'>
          { this.makeNavigator('Online') }
        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={this.showIntercomMessenger}
          selected={this.state.currentTab === 'help'}
          iconName='question-circle'
          title='Help'>
            <View />
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
