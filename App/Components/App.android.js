'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ToolbarAndroid,
  Navigator
} = React;

var Search = require('./Search');
var ListingDetail = require('./ListingDetail');
var Intercom = require('../Utils/Intercom');
var SUGGESTIONS = require('../Constants/Suggestions');
var COLOURS = require('../Constants/Colours');

class Tab extends React.Component {
  _switchTab(name) {
    this.props.navigator.replace({ name });
  }

  getSelected() {
    return this.props.children === 'Food' ? styles.selectedTab : {};
  }

  render() {
    return (
      <TouchableHighlight style={[styles.tab, this.getSelected()]} onPress={this._switchTab.bind(this, this.props.children)} underlayColor='rgba(0,0,0,0.6)'>
        <Text style={styles.tabText}>{this.props.children.toUpperCase()}</Text>
      </TouchableHighlight>
    );
  }
}

Tab.propTypes = {
  children: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.object.isRequired
};

class TabBar extends React.Component {
  render() {
    return (
      <View style={styles.tabBar}>
       { ['Food', 'Shops', 'Online', 'Services'].map((n) => <Tab navigator={this.props.navigator}>{n}</Tab> ) }
      </View>
    );
  }
}

TabBar.propTypes = {
  navigator: React.PropTypes.object.isRequired
};

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
    case 'Food': return this.buildSearch('Food', navigator);
    case 'Shops': return this.buildSearch('Shops', navigator);
    case 'Online': return this.buildSearch('Online', navigator);
    case 'Services': return this.buildSearch('Services', navigator);
    case 'listing': return <ListingDetail listing={route.listing} navigator={navigator} />;
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
        <TabBar navigator={this.state.navigator} />
        <Navigator
          ref={(c) => {
            if (!this.state.navigator) { this.setState({ navigator: c }); }
          }}
          initialRoute={{name: 'Food'}}
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
