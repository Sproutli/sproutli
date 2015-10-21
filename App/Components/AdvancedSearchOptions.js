/* global fetch */
'use strict';
var React = require('react-native');
var {
  Text,
  View
} = React;
var API_KEY = 'AIzaSyAgb2XoUPeXZP3jKAqhaWX-D5rfkyIIi7E';
var VeganLevelSlider = require('./VeganLevelSlider');

class AdvancedSearchOptions extends React.Component {
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
            location = {
              latitude: location.lat,
              longitude: location.lng
            };
            that.props.onLocationSelected(location);
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
      <View>
        <Text>Location:</Text>
        <GooglePlacesAutocomplete />
        <Text>Vegan Level:</Text>
        <VeganLevelSlider veganLevel={this.props.veganLevel} onSlidingComplete={this.props.onVeganLevelChanged.bind(this)} />
      </View>
    );
  }
}

AdvancedSearchOptions.propTypes = {
  onLocationSelected: React.PropTypes.func.isRequired,
  onVeganLevelChanged: React.PropTypes.func.isRequired,
  veganLevel: React.PropTypes.number.isRequired
};

module.exports = AdvancedSearchOptions;
