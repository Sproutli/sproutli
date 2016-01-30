'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Navigator,
  BackAndroid,
  TouchableHighlight,
  ToolbarAndroid
} = React;

var Search = require('./Search');
var Intercom = require('../Utils/Intercom');
var SUGGESTIONS = require('../Constants/Suggestions');
var COLOURS = require('../Constants/Colours');

var SCREENS = ['Food', 'Shops', 'Services', 'Online'];


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      searchListeners: [],
      title: 'Search',
      page: 0,
      actions: [{
        title: 'Search',
        icon: require('../Images/ic_search_white.png'),
        show: 'always',
        func: () => this.state.searchListeners.forEach( l => { l(); })
      }]
    },
    this.navigators = [];
    this.actionsCache = [];
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
    this.setState({ page }, () => {
      var currentRoutes = this.navigators[page].getCurrentRoutes(), 
        currentRoute = currentRoutes[currentRoutes.length - 1],
        title = currentRoute.title;

      this.setState({ 
        actions: this.actionsCache[page] || [],
        title 
      });
    });
  }

  _onPageSelected(e) {
    var page = e.nativeEvent.position;
    this._onTabSelected(page);
  }

  _onActionSelected(actionIndex) {
    this.state.actions[actionIndex].func();
  }

  makeNavigatorOperations(index) {
    return {
      setActions: (actions) => {
        this.actionsCache[index] = actions;
        this.setState({ actions });
      },

      push: (route) => {
        this.setState({ actions: [], title: route.title });
        this.navigators[index].push(route);
      },

      pop: () => {
        var navigator = this.navigators[index];
        var previousRouteIndex = navigator.getCurrentRoutes().length - 2;
        var previousRoute = navigator.getCurrentRoutes()[previousRouteIndex];

        var actions = previousRoute.passProps.listing ? this.actionsCache[index] : [];
        if (actions.length < 1) { this.actionsCache[index] = []; }

        this.setState({ title: previousRoute.title, actions});
        navigator.pop();
      }
    };
  }

  buildSearch(name, index) {
    var navigationOperations = this.navigationOperations[index];

    return (
      <View style={{flex: 1}} key={index}>
        <Navigator 
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}
          renderScene={this.RouteMapper(index).bind(this)}
          initialRoute={{
            title: 'Search',
            component: Search,
            passProps: { 
              searchListeners: this.state.searchListeners,
              showSearch: this.state.showSearch,
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
    var image = require('../Images/ic_arrow_back_white.png');
    if (this.state.title !== 'Search') return image;
  }
  
  render() {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          overflowIcon={require('../Images/ic_more_vert_white.png')}
          actions={this.state.actions}
          onActionSelected={this._onActionSelected.bind(this)}
          navIcon={this.needsNavIcon()}
          titleColor='white'
          onIconClicked={() => {
            this.navigationOperations[this.state.page].pop();
          }}
          title={this.state.title}
          style={styles.toolbar}
        />
        { this.tabBar() }
        {this.pages[this.state.page]}
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
