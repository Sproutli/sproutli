'use strict';

import { StyleSheet, TextInput, Animated, View } from 'react-native';
import React from 'react';
import AdvancedSearchOptions from './AdvancedSearchOptions';

var COLOURS = require('../Constants/Colours');

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
          <TextInput
            text={this.props.query}
            placeholder='Search'
            placeholderTextColor={COLOURS.GREY}
            defaultValue={this.props.query}
            style={styles.search}
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
  query: React.PropTypes.string
};

var styles = StyleSheet.create({
  search: {
    height: 44,
    marginHorizontal: 8,
    fontSize: 14,
    paddingHorizontal: 8,
    //borderColor: 'black',
    //borderWidth: 2,
  }
});

module.exports = SearchBox;
