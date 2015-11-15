'use strict';
var React = require('react-native');
var {
  Platform,
  View
} = React;

var VeganLevelSlider = require('./VeganLevelSlider');
var COLOURS = require('../Constants/Colours');

class AdvancedSearchOptions extends React.Component {
  render() {
    var that = this;
    var API_KEY = 'AIzaSyAgb2XoUPeXZP3jKAqhaWX-D5rfkyIIi7E';
    var GooglePlacesAutocomplete = require('react-native-google-places-autocomplete').create({
      placeholder: 'Location',
      fetchDetails: true,
      styles: styles[Platform.OS],
      getDefaultValue: () => this.props.locationName,
      onPress(place, placeDetails) {
        if (place === null) { 
          that.props.onLocationSelected(null); 
          return;
        }

        var geometry = placeDetails.geometry.location;
        geometry = {
          latitude: geometry.lat,
          longitude: geometry.lng
        };
        var location = {
          geometry,
          name: placeDetails.name
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
        { this.props.showLocationBar ? <GooglePlacesAutocomplete /> : <View /> }

        <VeganLevelSlider 
          veganLevel={this.props.veganLevel} 
          onSlidingComplete={this.props.onVeganLevelChanged.bind(this)} 
        />
      </View>
    );
  }
}

var styles = {
  'ios' : {
    textInput: {
      paddingTop: 4.5,
      paddingBottom: 4.5,
      marginTop: 7.5,
      marginHorizontal: 8,
      paddingHorizontal: 8,
      borderRadius: 6,
      backgroundColor: COLOURS.LIGHT_GREY,
      height: 34
    }
  }, 
  'android' : {
    textInput: {
      height: 44,
      marginHorizontal: 4
    }
  }
};

AdvancedSearchOptions.propTypes = {
  onLocationSelected: React.PropTypes.func.isRequired,
  onVeganLevelChanged: React.PropTypes.func.isRequired,
  veganLevel: React.PropTypes.number.isRequired,
  locationName: React.PropTypes.string.isRequired,

  showLocationBar: React.PropTypes.bool
};

module.exports = AdvancedSearchOptions;
