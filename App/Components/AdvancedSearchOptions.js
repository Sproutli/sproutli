'use strict';
var React = require('react-native');
var {
  View
} = React;
var API_KEY = 'AIzaSyAgb2XoUPeXZP3jKAqhaWX-D5rfkyIIi7E';
var VeganLevelSlider = require('./VeganLevelSlider');
class AdvancedSearchOptions extends React.Component {
  render() {
    var that = this;
    var GooglePlacesAutocomplete = require('react-native-google-places-autocomplete').create({
      placeholder: 'Location',
      fetchDetails: true,
      styles: styles,
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
  textInput: {
    marginHorizontal: 4,
    height: 44
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
