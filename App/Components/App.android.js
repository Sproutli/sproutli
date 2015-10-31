'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ViewPagerAndroid,
  Navigator,
  TouchableHighlight,
  ToolbarAndroid
} = React;

var Search = require('./Search');
var ListingDetail = require('./ListingDetail');
var Intercom = require('../Utils/Intercom');
var SUGGESTIONS = require('../Constants/Suggestions');
var COLOURS = require('../Constants/Colours');

var SCREENS = ['Food', 'Shops', 'Online', 'Services'];

var RouteMapper = (route) => {
  console.log('Route mapper called!');
  return (
    <Search 
      key={route.name} 
      searchLabel={route.name} 
      navigator={route.navigator}
      searchConfig={SUGGESTIONS[route.name].searchConfig} 
    />
  );
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      title: 'Search',
      page: 0
    },
    this.navigators = [];
    Intercom.userLoggedIn();
  }

  createTab(name, index) {
    return (
      <TouchableHighlight 
        key={index} 
        style={[styles.tab, index === this.state.page ? styles.selectedTab : {}]} 
        onPress={this._onTabSelected.bind(this, index)} 
        underlayColor='rgba(0,0,0,0.6)'
      >
        <Text style={styles.tabText}>{name.toUpperCase()}</Text>
      </TouchableHighlight>
    );
  }

  tabBar() {
    return (
      <View style={styles.tabBar}>
       { SCREENS.map((n, i) => this.createTab(n, i)) }
      </View>
    );
  }

  _onTabSelected(page) {
    this.viewPager && this.viewPager.setPage(page);
    this.setState({ page });
  }

  _onPageSelected(e) {
    this.setState({ page: e.nativeEvent.position });
  }

  makeNavigator(index) {
    return {
      push: (route) => {
        this.navigators[index].push(route);
      }
    };
  }

  buildSearch(name, index) {
    var navigator = this.makeNavigator(index);

    return (
      <View key={index}>
        <Navigator 
          renderScene={RouteMapper}
          initialRoute={{ name, navigator }}
          ref={(n) => this.navigators[index] = n} />
      </View>
    );
  }
  
  _renderScene(route, navigator) {
    switch(route.name) {
    case 'Food': return this.buildSearch('Food', navigator);
    case 'Shops': return this.buildSearch('Shops', navigator);
    case 'Online': return this.buildSearch('Online', navigator);
    case 'Services': return this.buildSearch('Services', navigator);
    case 'listing': return <ListingDetail listing={route.listing} navigator={navigator} />;
    }
  }

  render() {
    var pages = SCREENS.map((s, i) => this.buildSearch(s, i));

    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          titleColor='white'
          title={this.state.title}
          style={styles.toolbar}
        />
        { this.tabBar() }
        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={0}
          onPageSelected={this._onPageSelected.bind(this)}
          ref={viewPager => { this.viewPager = viewPager ; } }
        >
          {pages}
        </ViewPagerAndroid>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  viewPager: {
    flex: 1
  },

  toolbar: {
    height: 56,
    marginBottom: 0,
    backgroundColor: COLOURS.GREY
  },

  tabBar: {
    flexDirection: 'row',
    height: 48
  },

  tabText: {
    color: 'white',
    textAlign: 'center'
  },

  tab: {
    backgroundColor: COLOURS.GREY,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: COLOURS.GREY,
    borderBottomWidth: 2
  },

  selectedTab: {
    borderBottomColor: COLOURS.GREEN
  },

  iconBar: {
    flex: 1,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }

});

module.exports = App;
