/*global navigator */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  ListView,
  ActivityIndicatorIOS,
  Text,
  ScrollView,
  PixelRatio,
  View
} = React;

var RNGeocoder = require('react-native-geocoder');
var Icon = require('react-native-vector-icons/Ionicons');
var Moment = require('moment');

var SearchBox = require('./SearchBox');
var Listing = require('./Listing');
var ListingDetail = require('./ListingDetail');
var AdvancedSearchOptions = require('./AdvancedSearchOptions');

var SearchEngine = require('../Utils/SearchEngine');
var ListingsFilter = require('../Utils/ListingsFilter');
var Intercom = require('../Utils/Intercom');
var GoogleAnalytics = require('../Utils/GoogleAnalytics');
var VeganLevelManager = require('../Utils/VeganLevelManager');

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
      loading: true,
      showSearch: true,
      locationName: '',
      veganLevel: VeganLevelManager.veganLevel,
      searchConfig: props.searchConfig,
      showAdvancedSearchOptions: true
    };

    this.state.searchConfig.vegan_level = VeganLevelManager.veganLevel;
    VeganLevelManager.handlers.push(this._onVeganLevelChanged.bind(this));

    this.lastOffset = 0;

    this.getLocation();

    var action = props.query ? 'custom search' : props.searchLabel;
    Intercom.logEvent(`searched_for_${action}`, {
      query: props.query
    });

    GoogleAnalytics.viewedScreen('Search');
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

    // this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
    //   this.setState({ location: lastPosition.coords });
    // });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  search(location, query) {
    query = query || this.state.query;
    GoogleAnalytics.trackEvent('Search', 'query', this.state.query);
    GoogleAnalytics.trackEvent('Search', 'has_location', location !== null);
    GoogleAnalytics.trackEvent('Search', 'vegan_level', this.state.searchConfig.vegan_level);
    GoogleAnalytics.trackEvent('Search', 'pre_canned', this.props.searchLabel);

    this.setState({ loading: true });

    var searchConfig = this.state.searchConfig;
    location = searchConfig.online_store === 'Y' ? null : location; // We don't want the location if we're searching for online stuff.


    this.startedSearch = new Moment();
    SearchEngine.search(this.state.query, location)
      .then((listings) => {
        var searchTime = new Moment().diff(this.startedSearch);
        console.log('[Search] - Time elapsed:', searchTime);
        GoogleAnalytics.trackEvent('Search', 'time_taken', searchTime);

        var filteredListings = listings.filter((l) => ListingsFilter.filter(l, searchConfig));

        this.setState({
          listings,
          numberOfListings: filteredListings.length,
          loading: false,
          dataSource: this.state.dataSource.cloneWithRows(filteredListings)
        });
      })
      .catch((error) => console.warn('[Search] - Error searching:', error));
  }

  _onChangeText(text) {
    this.setState({ query: text }, () => {
      // Search for everything if the text was cleared.
      if (text.length < 1) { this.search(this.state.location); }
    });

  }

  _onSearch() {
    this.search(this.state.location);
  }

  _onVeganSliderChanged(veganLevel) {
    Intercom.logEvent('changed_vegan_level', { veganLevel });
    VeganLevelManager.set(veganLevel);
  }

  _onVeganLevelChanged(veganLevel) {
    this.setState({ veganLevel });

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

    console.log(scrollEvent.nativeEvent, this.lastOffset);

    if (offset < 0 || bounced) { return; }

    if (delta < 1 || offset == 0) {
      this.setState({ showSearch: true });
    } else if (this.state.showSearch && delta < 50) {
      this.setState({ showSearch: true });
    } else if (delta > 1 ) {
      this.setState({ showSearch: false });
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
      /> 
    );
  }

  renderAdvancedSearch() {
    if (!this.state.showSearch) { return <View />; }

    try {
      return (
        <AdvancedSearchOptions 
          veganLevel={this.state.veganLevel}
          onLocationSelected={this._onLocationSelected.bind(this)} 
          onVeganLevelChanged={this._onVeganSliderChanged.bind(this)}
          locationName={this.state.locationName}
          showLocationBar={this.state.searchConfig.online_store !== 'Y'}
        />
      );
    } catch (error) { console.warn('GOT SOME BAD ERROR', error); }
  }

  renderListings() {
    if (this.state.loading) { 
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicatorIOS size='large' />
          <Text style={styles.loadingText}>Just a moment..</Text>
        </View>
      );
    }

    if (this.state.numberOfListings < 1) {
      return (
        <ScrollView contentContainerStyle={styles.loadingContainer} keyboardShouldPersistTaps={false} keyboardDismissMode='on-drag'>
          <Icon name='sad-outline' size={100} color={COLOURS.GREY} />
          <Text style={styles.loadingText}>Sorry! No listings found.</Text>
        </ScrollView>
      );
    }

    return ( 
      <ListView
        onScroll={this._onScroll.bind(this)}
        dataSource={this.state.dataSource}
        keyboardShouldPersistTaps={false}
        keyboardDismissMode='on-drag'
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
  searchConfig: React.PropTypes.object.isRequired,
  navigator: React.PropTypes.object.isRequired,
  searchLabel: React.PropTypes.string.isRequired,

  query: React.PropTypes.string
};

module.exports = Search;
