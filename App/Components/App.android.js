'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ViewPagerAndroid,
  Navigator,
  BackAndroid,
  TouchableHighlight,
  ToolbarAndroid
} = React;

var Search = require('./Search');
var Intercom = require('../Utils/Intercom');
var SUGGESTIONS = require('../Constants/Suggestions');
var COLOURS = require('../Constants/Colours');

var SCREENS = ['Food', 'Shops', 'Online', 'Services'];


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      title: 'Search',
      page: 0
    },
    this.navigators = [];
    this.navigationOperations = SCREENS.map((s, i) => this.makeNavigatorOperations(i));
    this.pages = SCREENS.map((s, i) => this.buildSearch(s, i));
    Intercom.userLoggedIn();

    BackAndroid.addEventListener('hardwareBackPress', () => {
      var navigator = this.navigationOperations[this.state.page];
      if (navigator && this.navigators[this.state.page].getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
      }
      return false;
    });
  }

  RouteMapper(index) {
    return (route) => {
      var Component = route.component;
      return (
        <Component navigator={this.navigationOperations[index]} {...route.passProps} />
      );
    };
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
    var action = SCREENS[page];
    Intercom.logEvent(`searched_for_${action}`);

    this.viewPager && this.viewPager.setPage(page);

    var currentRoutes = this.navigators[page].getCurrentRoutes(); 
    var title = currentRoutes[currentRoutes.length - 1].title;

    this.setState({ 
      page,
      title 
    });
  }

  _onPageSelected(e) {
    var page = e.nativeEvent.position;
    this._onTabSelected(page);
  }

  makeNavigatorOperations(index) {
    return {
      push: (route) => {
        setTimeout(() => { this.setState({ title: route.title }); }, 100);
        this.navigators[index].push(route);
      },

      pop: () => {
        var navigator = this.navigators[index];
        var previousRouteIndex = navigator.getCurrentRoutes().length - 2;
        var previousRoute = navigator.getCurrentRoutes()[previousRouteIndex];
        setTimeout(() => { this.setState({ title: previousRoute.title }); }, 100);
        navigator.pop();
      }
    };
  }

  buildSearch(name, index) {
    var navigationOperations = this.navigationOperations[index];

    return (
      <View key={index}>
        <Navigator 
          renderScene={this.RouteMapper(index).bind(this)}
          initialRoute={{
            title: 'Search',
            component: Search,
            passProps: { 
              searchLabel: name,
              navigator: navigationOperations,
              searchConfig: SUGGESTIONS[name].searchConfig
            }
          }}
          ref={(n) => this.navigators[index] = n} />
      </View>
    );
  }

  needsNavIcon() {
    if (this.state.title !== 'Search') return require('image!android_back_white');
  }
  
  render() {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          navIcon={this.needsNavIcon()}
          titleColor='white'
          onIconClicked={() => {
            this.navigationOperations[this.state.page].pop();
          }}
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
          {this.pages}
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
