'use strict';

import { View, StyleSheet, TextInput, Animated } from 'react-native';
import AdvancedSearchOptions from './AdvancedSearchOptions';
import SearchBar from 'react-native-search-bar';
import COLOURS from '../Constants/Colours';
import React from 'react';

class SearchBox extends React.Component {
  constructor() {
    super();
    this.state = { 
      searchBoxHeight:  new Animated.Value(-500)
    };
  }

  componentDidMount() {
    Animated.spring(
      this.state.searchBoxHeight,
      { 
        toValue: 0
      }
    ).start();
  }

  componentWillUnmount() {
    Animated.spring(
      this.state.searchBoxHeight,
      { 
        toValue: -500 
      }
    ).start();
  }

  render() {
    return (
      <Animated.View style={{ transform: [{ translateY: this.state.searchBoxHeight }]}}>
        <View style={{marginTop: 4, marginBottom: 4, backgroundColor: 'white'}}>
          <SearchBar 
            text={this.props.query}
            barTintColour={COLOURS.GREEN}
            placeholder='Search'
            hideBackground
            textFieldBackgroundColor='#f8f8f8'
            tintColor={COLOURS.GREEN}
            onChangeText={this.props.onChangeText}
            onSearchButtonPress={this.props.onSubmitEditing}
            onFocus={this.props.onFocus}
           /> 
          <AdvancedSearchOptions 
            veganLevel={this.props.veganLevel}
            onLocationSelected={this.props.onLocationSelected} 
            onVeganLevelChanged={this.props.onVeganLevelChanged}
            locationName={this.props.locationName}
            showLocationBar={this.props.showLocationBar}
          />
         </View>
       </Animated.View>
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
  onFocus: React.PropTypes.func,
  query: React.PropTypes.string
};

module.exports = SearchBox;
