'use strict';

var React = require('react-native');
var {
  StyleSheet,
  NavigatorIOS,
  LinkingIOS,
  TabBarIOS
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

var AddListing = require('./AddListing');
var Search = require('./Search');
var Intercom = require('../Utils/Intercom');
var ListingFetcher = require('../Utils/ListingFetcher');
var KindnessCard = require('./KindnessCard');
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

    LinkingIOS.addEventListener('url', this._handleOpenURL.bind(this));

    var url = LinkingIOS.popInitialURL();

    if (url) {
      this._handleOpenURL({url});
    }

  }

  componentWillUnmount() {
    LinkingIOS.removeEventListener('url', this._handleOpenURL.bind(this));
  }

  _handleOpenURL(event) {
    console.log('Got incoming eventURL:', event.url);
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
          passProps: {searchConfig: SUGGESTIONS[name].searchConfig, searchLabel:name, veganLevel: this.veganLevel},
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
