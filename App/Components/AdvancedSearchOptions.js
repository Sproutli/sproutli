'use strict';
import React from 'react';
import {
  Platform,
  View
} from 'react-native';

var VeganLevelSlider = require('./VeganLevelSlider');
var COLOURS = require('../Constants/Colours');

class AdvancedSearchOptions extends React.Component {
  render() {
    var that = this;
    var API_KEY = 'AIzaSyAgb2XoUPeXZP3jKAqhaWX-D5rfkyIIi7E';
    var GooglePlacesAutocomplete = require('react-native-google-places-autocomplete').create({
      placeholder: 'Location',
      placeholderTextColor: COLOURS.GREY,
      fetchDetails: true,
      enablePoweredByContainer: false,
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
    });

    return (
      <View style={styles.container}>
        <View style={{height: 44}} >
          { this.props.showLocationBar ? <GooglePlacesAutocomplete /> : <View /> }
        </View>
        <VeganLevelSlider
          veganLevel={this.props.veganLevel}
          onSlidingComplete={this.props.onVeganLevelChanged.bind(this)}
        />
      </View>
    );
  }
}



var styles = {
  container: {
    flex: 0,
  },

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
      //paddingTop: 4.5,
      //paddingBottom: 4.5,
      paddingHorizontal: 8,
      margin: 0,
      fontSize: 14,
      marginHorizontal: 8,
      //borderColor: 'black',
      //borderWidth: 2,
      borderRadius: 0,
      marginTop: 0,
    },

    textInputContainer: {
      height: 44,
      borderTopWidth: 0,
      borderBottomWidth:0,
      backgroundColor: 'white',
    },
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
