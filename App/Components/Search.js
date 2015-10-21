/*global navigator */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  ListView,
  ActivityIndicatorIOS,
  View
} = React;

var SearchEngine = require('../Utils/SearchEngine');
var ListingsFilter = require('../Utils/ListingsFilter');
var SearchBox = require('./SearchBox');
var Listing = require('./Listing');
var ListingDetail = require('./ListingDetail');
var AdvancedSearchOptions = require('./AdvancedSearchOptions');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      query: props.query,
      location: {},
      listings: [],
      loading: false,
      searchConfig: props.searchConfig
    };

    this.getLocation();
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => { 
      var location = position.coords;
      this.setState({ location });
      this.search(location);
    },
      (error) => {
      console.warn('Error getting location', error);
      this.setState({ location: null });
      this.search(null);
    }
    );

    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({ location: lastPosition.coords });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  search(location) {
    this.setState({ loading: true });

    var searchConfig = this.state.searchConfig;
    location = location || this.state.location;
    location = searchConfig.online_store !== 'N' ? location : null; // We don't want the location if we're searching for online stuff.

    SearchEngine.search(this.state.query, location)
      .then((listings) => {
        var filteredListings = listings.filter((l) => ListingsFilter.filter(l, searchConfig));
        this.setState({
          listings,
          loading: false,
          dataSource: this.state.dataSource.cloneWithRows(filteredListings)
        });
      });
  }

  _onChangeText(text) {
    this.setState({ query: text });
  }

  _onSearch() {
    this.search();
  }

  _onVeganLevelChanged(veganLevel) {
    var searchConfig = this.state.searchConfig;
    searchConfig.vegan_level = veganLevel;
    var listings = this.state.listings.filter((l) => ListingsFilter.filter(l, searchConfig));

    this.setState({ 
      searchConfig,
      dataSource: this.state.dataSource.cloneWithRows(listings)
    });
  }

  _onFocus() {
    this.setState({ showAdvancedSearchOptions: true });
  }

  _onLocationSelected(location) {
    this.setState(location);
    this.search(location);
  }

  listingPressed(listing) {
    this.props.navigator.push({
      component: ListingDetail,
      title: listing.name,
      passProps: { listing }
    });
  }

  renderListings() {
    if (this.state.loading) { 
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicatorIOS size='large' />
        </View>
      );
    }

    return ( 
      <ListView
        styles={{paddingTop: 0}}
        dataSource={this.state.dataSource}
        renderRow={(listing, index) => <Listing key={index} listing={listing} handler={this.listingPressed.bind(this, listing)} />}
      />
   );
  }

  render() {
    return (
      <View style={styles.bigContainer}>
        <SearchBox 
          onChangeText={this._onChangeText.bind(this)} 
          onSubmitEditing={this._onSearch.bind(this)} 
          onFocus={this._onFocus.bind(this)} />

        { this.state.showAdvancedSearchOptions ? <AdvancedSearchOptions 
          veganLevel={this.state.searchConfig.vegan_level}
          onLocationSelected={this._onLocationSelected.bind(this)} 
          onVeganLevelChanged={this._onVeganLevelChanged.bind(this)}
          /> : <View /> }

        { this.renderListings() }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 32
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
});

Search.propTypes = {
  navigator: React.PropTypes.object.isRequired
};

module.exports = Search;
