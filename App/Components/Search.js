/*global navigator */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  ListView,
  ActivityIndicatorIOS,
  Text,
  PixelRatio,
  View
} = React;

var RNGeocoder = require('react-native-geocoder');
var Icon = require('react-native-vector-icons/Ionicons');

var SearchBox = require('./SearchBox');
var Listing = require('./Listing');
var ListingDetail = require('./ListingDetail');
var AdvancedSearchOptions = require('./AdvancedSearchOptions');

var SearchEngine = require('../Utils/SearchEngine');
var ListingsFilter = require('../Utils/ListingsFilter');
var Intercom = require('../Utils/Intercom');

var VEGAN_LEVELS = require('../Constants/VeganLevels');
var COLOURS = require('../Constants/Colours');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      query: props.query,
      location: {},
      listings: [],
      numberOfListings: null,
      loading: false,
      showSearch: true,
      locationName: '',
      searchConfig: props.searchConfig,
      showAdvancedSearchOptions: true
    };

    this.lastOffset = 0;

    this.getLocation();

    var action = props.query ? 'custom search' : props.searchLabel;
    Intercom.logEvent(`searched_for_${action}`, {
      query: props.query
    });
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => { 
      var location = position.coords;
      this.setState({ location });
      this.search(location);
      RNGeocoder.reverseGeocodeLocation(location)
        .then((geocodedLocation) => this.setState({ locationName: geocodedLocation[0].locality }))
        .catch((error) => this.warn('[Search] - Error getting reverse geocode', error));
    },
      (error) => {
      console.warn('[Search] - Error getting location', error);
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
    location = searchConfig.online_store !== 'N' ? location : null; // We don't want the location if we're searching for online stuff.

    SearchEngine.search(this.state.query, location)
      .then((listings) => {
        console.log('Filtering listings..');
        var filteredListings = listings.filter((l) => ListingsFilter.filter(l, searchConfig));
        console.log('Done.');
        this.setState({
          listings,
          numberOfListings: filteredListings.length,
          loading: false,
          dataSource: this.state.dataSource.cloneWithRows(filteredListings)
        });
      });
  }

  _onChangeText(text) {
    this.setState({ query: text });
  }

  _onSearch() {
    this.search(this.state.location);
  }

  _onVeganLevelChanged(veganLevel) {
    Intercom.logEvent('changed_vegan_level', { veganLevel });
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
    // TODO: Horrible, refactor.
    if (location === null) {
      Intercom.logEvent('cleared_location');
      this.setState({
        location: null,
        locationName: null
      }, this.search(null));
      return;
    }


    Intercom.logEvent('changed_location');
    this.setState({
      location: location.geometry,
      locationName: location.name
    });
    this.search(location.geometry);
  }

  _onScroll(scrollEvent) {
    var offset = scrollEvent.nativeEvent.contentOffset.y,
      delta = offset - this.lastOffset;

    var bounced = ((offset - scrollEvent.nativeEvent.contentSize.height) > -scrollEvent.nativeEvent.layoutMeasurement.height);

    if (offset < 0 || bounced) { return; }

    if (delta < 1) {
      this.setState({ showSearch: true });
    } else if (delta > 1 ) {
      this.setState({ 
        showSearch: false,
        showAdvancedSearchOptions: false
      });
    }

    this.lastOffset = offset;
  }

  listingPressed(listing) {
    this.props.navigator.push({
      component: ListingDetail,
      title: listing.name,
      passProps: { listing }
    });
  }

  veganLevelText() {
    return VEGAN_LEVELS[Math.round(this.state.searchConfig.vegan_level)].short;
  }

  renderSearch() {
    if (!this.state.showSearch) { return <View />; }

    return (
      <SearchBox
        query={this.state.query}
        onChangeText={this._onChangeText.bind(this)} 
        onSubmitEditing={this._onSearch.bind(this)} 
        onFocus={this._onFocus.bind(this)} 
        location={this.state.locationName}
        searchLabel={this.props.searchLabel}
        numberOfListings={this.state.numberOfListings}
        veganLevelText={this.veganLevelText()}
      /> 
    );
  }

  renderAdvancedSearch() {
    if (!this.state.showSearch) { return <View />; }

    return (
      <AdvancedSearchOptions 
        veganLevel={this.state.searchConfig.vegan_level}
        onLocationSelected={this._onLocationSelected.bind(this)} 
        onVeganLevelChanged={this._onVeganLevelChanged.bind(this)}
        locationName={this.state.locationName}
      />
    );
  }

  renderListings() {
    console.log('Rendering listings');
    if (this.state.loading) { 
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicatorIOS size='large' />
          <Text style={styles.loadingText}>Just a moment..</Text>
        </View>
      );
    }

    if (this.state.listings.length < 1) {
      return (
        <View style={styles.loadingContainer}>
          <Icon name='sad-outline' size={100} color={COLOURS.GREY} />
          <Text style={styles.loadingText}>Sorry! No listings found.</Text>
        </View>
      );
    }
    console.log('Actually Rendering listings');

    return ( 
      <ListView
        onScroll={this._onScroll.bind(this)}
        dataSource={this.state.dataSource}
        renderRow={(listing, index) => <Listing key={index} listing={listing} handler={this.listingPressed.bind(this, listing)} />}
      />
   );
  }

  render() {
    return (
      <View style={styles.bigContainer}>
        { this.renderSearch() }

        { this.renderAdvancedSearch() }

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
    justifyContent: 'center'
  },

  loadingText: {
    paddingTop: 30,
    fontSize: PixelRatio.get() === 3 ? 20 : 12,
    color: COLOURS.GREY
  }
});

Search.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  query: React.PropTypes.string,
  searchLabel: React.PropTypes.string.isRequired
};

module.exports = Search;
