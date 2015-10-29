'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ToolbarAndroid,
  Navigator
} = React;

var Search = require('./Search');
var ListingDetail = require('./ListingDetail');
var Intercom = require('../Utils/Intercom');
var SUGGESTIONS = require('../Constants/Suggestions');
var COLOURS = require('../Constants/Colours');

class Tab extends React.Component {
  getSelected() {
    return this.props.children === 'Food' ? styles.selectedTab : {};
  }

  render() {
    return (
      <View style={[styles.tab, this.getSelected()]}>
        <Text style={styles.tabText}>{this.props.children.toUpperCase()}</Text>
      </View>
    );
  }
}

Tab.propTypes = {
  children: React.PropTypes.string.isRequired
};

class TabBar extends React.Component {
  render() {
    return (
      <View style={styles.tabBar}>
       { ['Food', 'Shops', 'Online', 'Services'].map((n) => <Tab>{n}</Tab> ) }
      </View>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      title: 'Search'
    },
    Intercom.userLoggedIn();
  }

  buildSearch(name, navigator) {
    return <Search navigator={navigator} searchLabel={name} searchConfig={SUGGESTIONS[name].searchConfig} />;
  }
  
  _renderScene(route, navigator) {
    switch(route.name) {
    case 'food': return this.buildSearch('Food', navigator);
    case 'shops': return this.buildSearch('Shops', navigator);
    case 'online': return this.buildSearch('Online', navigator);
    case 'services': return this.buildSearch('Services', navigator);
    case 'listing': 
      this.setState({ title: route.listing.name });
      return <ListingDetail listing={route.listing} navigator={navigator} />;
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          titleColor='white'
          title={this.state.title}
          style={styles.toolbar}
        />
        <TabBar />
        <Navigator
          initialRoute={{name: 'food'}}
          renderScene={this._renderScene.bind(this)}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
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
    justifyContent: 'center'
  },

  selectedTab: {
    borderBottomWidth: 2,
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
