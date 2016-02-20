/*global navigator */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  ListView,
  ProgressBarAndroid,
  ActivityIndicatorIOS,
  Text,
  ScrollView,
  Platform,
  PixelRatio,
  View
} = React;

var RNGeocoder = require('react-native-geocoder');
var Icon = require('react-native-vector-icons/Ionicons');
import ActionButton from 'react-native-action-button';
var Moment = require('moment');
var Debounce = require('debounce');

var SearchBox = require('./SearchBox');
var Listing = require('./Listing');
var ListingDetail = require('./ListingDetail');
var AddListing = require('./AddListing');
import LoadingScreen from './LoadingScreen';

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
      showSearch: props.showSearch,
      locationName: '',
      veganLevel: VeganLevelManager.veganLevel,
      searchConfig: props.searchConfig,
      showAdvancedSearchOptions: true
    };

    if (Platform.OS === 'android') {
      props.searchListeners.push(() => { this.setState({ showSearch: !this.state.showSearch })});
    }

    this.state.searchConfig.vegan_level = VeganLevelManager.veganLevel;
    var debouncedVeganLevel = Debounce(this._onVeganLevelChanged.bind(this), 500);
    VeganLevelManager.handlers.push(debouncedVeganLevel);

    this.lastOffset = 0;

    this.getLocation();

    GoogleAnalytics.viewedScreen('Search');
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => { 
      var location = position.coords;
      this.setState({ location });
      this.search(location);
      RNGeocoder.reverseGeocodeLocation(location)
        .then((geocodedLocation) => {
          this.setState({ locationName: geocodedLocation[0].locality })
        })
        .catch((error) => console.warn('[Search] - Error getting reverse geocode', error.message));
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
      .catch((error) => {
        var message = '[Search] - Error searching';
        console.warn(message, error);
        GoogleAnalytics.trackError(message + ' ' + error, false);
        this.setState({ 
          loading: false,
          hasError: true
        });
      });
  }

  _onChangeText(text) {
    this.setState({ query: text }, () => {
      // Search for everything if the text was cleared.
      if (text.length < 1) { this.search(this.state.location); }
    });

  }

  _onSearch() {
    if (Platform.OS === 'android') {
      this.setState({ showSearch: false });
    }
    this.search(this.state.location);
  }

  _onVeganSliderChanged(veganLevel) {
    VeganLevelManager.set(veganLevel);
  }

  _onVeganLevelChanged(veganLevel) {
    var searchConfig = this.state.searchConfig;

    searchConfig.vegan_level = veganLevel;
    var filteredListings = this.state.listings.filter((l) => ListingsFilter.filter(l, searchConfig));

    this.setState({ 
      filteredListings,
      veganLevel,
      searchConfig,
      dataSource: this.state.dataSource.cloneWithRows(filteredListings)
    });
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
    console.log('On Scroll called');
    var offset = scrollEvent.nativeEvent.contentOffset.y,
      delta = offset - this.lastOffset;

    var bounced = ((offset - scrollEvent.nativeEvent.contentSize.height) > -scrollEvent.nativeEvent.layoutMeasurement.height);

    if (offset < 0 || bounced) { return; }

    if (delta < -20 || offset == 0) {
      this.setState({ showSearch: true });
    } else if (this.state.showSearch && delta < 20) {
      this.setState({ showSearch: true });
    } else if (delta > 1 ) {
      this.setState({ showSearch: false });
    }

    this.lastOffset = offset;
  }

  _onListingPressed(listing) {
    this.props.navigator.push({
      hasActions: true,
      navigator: this.props.navigator,
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
        location={this.state.locationName}
        searchLabel={this.props.searchLabel}
        numberOfListings={this.state.numberOfListings}
        veganLevel={this.state.veganLevel}
        onLocationSelected={this._onLocationSelected.bind(this)} 
        onVeganLevelChanged={this._onVeganSliderChanged.bind(this)}
        locationName={this.state.locationName}
        showLocationBar={this.state.searchConfig.online_store !== 'Y'}
      /> 
    );
  }

  renderListings() {
    if (this.state.hasError) { 
      return (
        <ScrollView contentContainerStyle={styles.loadingContainer} keyboardShouldPersistTaps={false} keyboardDismissMode='on-drag'>
          <Icon name='sad-outline' size={100} color={COLOURS.GREY} />
          <Text style={styles.loadingText}>There was an error searching - please try again!</Text>
        </ScrollView>
      );
    }

    if (this.state.loading) { 
      return (
        <LoadingScreen>Just a moment..</LoadingScreen>
      );
    }

    if (this.state.numberOfListings < 1) {
      return (
        <ScrollView 
          contentContainerStyle={styles.loadingContainer} 
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps={true}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode='on-drag'>
          <Icon name='sad-outline' size={100} color={COLOURS.GREY} />
          <Text style={styles.loadingText}>Sorry! No listings found.</Text>
        </ScrollView>
      );
    }

    return ( 
      <ListView
        dataSource={this.state.dataSource}
        keyboardShouldPersistTaps={false}
        keyboardDismissMode='on-drag'
        onScroll={this._onScroll.bind(this)}
        renderRow={(listing, index) => <Listing key={index} listing={listing} handler={this._onListingPressed.bind(this, listing)} />}
      />
   );
  }

  showAddListingScreen() {
    this.props.navigator.push({
      hasActions: false,
      navigator: this.props.navigator,
      component: AddListing,
      title: 'Add a Listing'
    });
  }

  renderFab() {
    if (Platform.OS === 'ios') { return; }

    return (
      <ActionButton buttonColor={COLOURS.GREY}>
        <ActionButton.Item title='Add a Listing' buttonColor={COLOURS.GREY} onPress={this.showAddListingScreen.bind(this)}>
          <Icon name="android-add" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item title='Ask a Question' buttonColor={COLOURS.GREY} onPress={() => Intercom.displayMessageComposer()}>
          <Icon name="ion-help" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton> 
    );
  }

  render() {
    return (
      <View style={styles.bigContainer}>
        { this.renderSearch() }

        { this.renderListings() }

        { this.renderFab() }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 64 : 0,
    paddingBottom: Platform.OS === 'ios' ? 32 : 0
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  loadingText: {
    marginTop: 30,
    fontSize: PixelRatio.get() === 3 ? 16 : 12,
    color: COLOURS.GREY
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white'
  }
});

Search.propTypes = {
  searchConfig: React.PropTypes.object.isRequired,
  navigator: React.PropTypes.object.isRequired,
  searchLabel: React.PropTypes.string.isRequired,

  query: React.PropTypes.string
};

module.exports = Search;
