'use strict';

import React, { StyleSheet, TextInput, Animated } from 'react-native';
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
    console.log('[SearchBox]', this.props.query);
    return (
      <Animated.View style={{ transform: [{ translateY: this.state.searchBoxHeight }]}}>
        <TextInput
          style={styles.search}
          defaultValue={this.props.query}
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
    marginHorizontal: 4
  }
});

module.exports = SearchBox;
