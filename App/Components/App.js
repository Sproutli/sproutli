'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var {
  StyleSheet,
  NavigatorIOS,
  TabBarIOS
} = React;

var Search = require('./Search');
var Feedback = require('./Feedback');
var KindnessCard = require('./KindnessCard');
var SUGGESTIONS = require('../Constants/Suggestions');
var COLOURS = require('../Constants/Colours');

var testListing = {
  rating: '5.0',
  instagram: '@street_espress_cafe',
  claimed: '1',
  postcode: '3196',
  images: [
    'https://sproutli-images.s3.amazonaws.com/efcb68fa-7a59-448c-b68b-b554c38faf11',
    'https://sproutli-images.s3.amazonaws.com/32aa2e85-56cc-4f46-b276-ab86d3a6c9da',
    'https://sproutli-images.s3.amazonaws.com/fb13183b-e8fa-4e28-b885-d905e5cbd6c3'
  ],
  id: '97b3f676-e4aa-468f-9029-80930ca9f9a0',
  offer_instructions: 'Show us your Kindness card and we will honor the discounts for all members.',
  vegan_level: '4',
  offer_details: '10% discount',
  locality: 'Chelsea',
  owner_is: 'vegan',
  location: '-38.05190899999999,145.115339',
  online_store: 'N',
  phone_number: '+61 481059857',
  email: 'caringcookcreations@gmail.com',
  website: 'http://www.streetespresscafe.com.au/',
  premium: '1',
  description: 'Everything on our menu is locally, ethically sourced and vegan (though we still do offer cows milk in our coffee if requested however this will be phased out of our business by December 2015). We cater for people of all walks of life with differing dietary requirements, including a wide array of gluten-free (gluten free) options. We use bio-cheese on our awesome burgers, have a famous vegan breakfast and have heaps of desserts to complete your meal - including our very own vanilla slice! During the warmer months we have cold pressed juices and a stunning array of salads and quick to grab meals so you can experience vegan heaven fast! ',
  tags: [
    'Coffee',
    'Catering',
    'Gluten-Free',
    'Cake',
    'Donuts',
    'Breakfast',
    'vanilla slice',
    'gluten free',
    'kid friendly',
    'Vegan',
    'burgers',
    'chips',
    'cold pressed juices',
    'salads',
    'organic',
    'preservative-free'
  ],
  facebook: 'https://www.facebook.com/streetespresscafe',
  categories: [
    'Cafes & Restaurants'
  ],
  offer_conditions: '10% off for visiting Sproutli members who purchase $20 or more worth of goods in store. Also 10% discount off all cooking workshops and classes as well as up and coming vegan cookbooks.',
  name: 'Street Espress Cafe',
  country: 'Australia',
  administrative_area_level_1: 'Victoria',
  cover_image: 'https://s3-ap-southeast-2.amazonaws.com/sproutli-images/street_espress_cafe.jpg',
  address_line_1: '398 Nepean Highway'
};

class App extends React.Component {
  constructor() {
    super();
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
          passProps: {searchConfig: SUGGESTIONS[name].searchConfig, searchLabel:name}
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
          onPress={() => this.setState({currentTab: 'online'})}
          selected={this.state.currentTab === 'online'}
          iconName='earth'
          title='Online'>
          { this.makeNavigator('Online') }
        </Icon.TabBarItem>

        <Icon.TabBarItem
          onPress={() => this.setState({currentTab: 'services'})}
          selected={this.state.currentTab === 'services'}
          iconName='ios-people'
          title='Services'>
          { this.makeNavigator('Services') }
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
