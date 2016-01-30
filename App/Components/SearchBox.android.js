'use strict';

import React, { StyleSheet, TextInput, View} from 'react-native';
import AdvancedSearchOptions from './AdvancedSearchOptions';

var COLOURS = require('../Constants/Colours');

class SearchBox extends React.Component {
  render() {
    return (
      <View>
        <TextInput
          style={styles.search}
          text={this.props.query}
          placeholder='Search'
          underlineColorAndroid={COLOURS.GREEN}
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          autoFocus={true}
         /> 
        <AdvancedSearchOptions 
          veganLevel={this.props.veganLevel}
          onLocationSelected={this.props.onLocationSelected} 
          onVeganLevelChanged={this.props.onVeganLevelChanged}
          locationName={this.props.locationName}
          showLocationBar={this.props.showLocationBar}
        />
      </View>
    );
  }
}

SearchBox.propTypes = {
  onSubmitEditing: React.PropTypes.func.isRequired,
  onChangeText: React.PropTypes.func.isRequired,

  searchLabel: React.PropTypes.string,
  veganLevelText: React.PropTypes.string,
  numberOfListings: React.PropTypes.number,
  onBlur: React.PropTypes.func,
  query: React.PropTypes.string
};

var styles = StyleSheet.create({
  search: {
    height: 44,
    marginHorizontal: 4
  }
});

module.exports = SearchBox;
