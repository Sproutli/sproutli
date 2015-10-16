'use strict';

var React = require('react-native');
var {
  TextInput,
  StyleSheet,
  Text,
  ListView,
  SliderIOS,
  ActivityIndicatorIOS,
  View
} = React;
var API_KEY = 'AIzaSyAgb2XoUPeXZP3jKAqhaWX-D5rfkyIIi7E';

var SearchEngine = require('../Utils/SearchEngine');
var SearchBox = require('./SearchBox');
var Listing = require('./Listing');
var ListingDetail = require('./ListingDetail');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      query: props.query,
      location: {},
      loading: false,
      searchConfig: props.searchConfig
    };

    this.getLocation();
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => { 
        var location = position.coords;
        this.setState({ location })
        this.search(location);
      },
      (error) => {
        console.warn('Error getting location', error)
        this.setState({ location: null })
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

    SearchEngine.search(this.state.query, location, searchConfig)
    .then((listings) => {
      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows(listings)
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

    this.setState({ 
      searchConfig
    });

    this.search();

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
    var that = this;

    var GooglePlacesAutocomplete = require('react-native-google-places-autocomplete').create({
      placeholder: 'Location',
      onPress(place) {
        var placeId = place.place_id;
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`)
          .then((res) => res.json())
          .then((placeDetails) => {
            var location = placeDetails.result.geometry.location;
            console.log(placeDetails);
            location = {
              latitude: location.lat,
              longitude: location.lng
            };
            console.log('Apres', location, 'Pres', that.state.location);
            that.setState({ location });
            that.search(location);
          })
          .catch((error) => console.warn(error));
      },
      minLength: 2,
      query: {
        key: API_KEY,
        language: 'en',
        types: 'geocode'
      }
    }).bind(this);



    return (
      <View style={styles.bigContainer}>
        <SearchBox onChangeText={this._onChangeText.bind(this)} onSubmitEditing={this._onSearch.bind(this)} />
        <GooglePlacesAutocomplete />
        <SliderIOS onSlidingComplete={this._onVeganLevelChanged.bind(this)} value={this.state.searchConfig.vegan_level} minimumValue={1} maximumValue={5} />
        <Text>{ Math.round(this.state.searchConfig.vegan_level) }</Text>
          
        { this.renderListings() }
      </View>
    );
  }
};

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

module.exports = Search;
