'use strict';
var React = require('react-native');
var {
  Text,
  View
} = React;
var API_KEY = 'AIzaSyAgb2XoUPeXZP3jKAqhaWX-D5rfkyIIi7E';
var VeganLevelSlider = require('./VeganLevelSlider');
var COLOURS = require('../Constants/Colours');

class AdvancedSearchOptions extends React.Component {
  render() {
    var that = this;
    var GooglePlacesAutocomplete = require('react-native-google-places-autocomplete').create({
      placeholder: 'Location',
      fetchDetails: true,
      styles: styles,
      onPress(place, placeDetails) {
        console.log(placeDetails);
        var location = placeDetails.geometry.location;
        location = {
          latitude: location.lat,
          longitude: location.lng
        };
        that.props.onLocationSelected(location);
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
        <GooglePlacesAutocomplete />
        <Text>Vegan Level:</Text>
        <VeganLevelSlider veganLevel={this.props.veganLevel} onSlidingComplete={this.props.onVeganLevelChanged.bind(this)} />
      </View>
    );
  }
}

var styles = {
  textInputContainer: {
    backgroundColor: '#fff'
  },
  textInput: {
    backgroundColor: COLOURS.LIGHT_GREY,
    height: 32,
    borderRadius: 3,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14
  }
};

AdvancedSearchOptions.propTypes = {
  onLocationSelected: React.PropTypes.func.isRequired,
  onVeganLevelChanged: React.PropTypes.func.isRequired,
  veganLevel: React.PropTypes.number.isRequired
};

module.exports = AdvancedSearchOptions;
