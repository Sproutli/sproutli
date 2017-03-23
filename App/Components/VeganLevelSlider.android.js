'use strict';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Slider
} from 'react-native';

//var Slider = require('react-native-material-kit').mdl.Slider;

var VEGAN_LEVELS = require('../Constants/VeganLevels');
var COLOURS = require('../Constants/Colours');

class VeganLevelSlider extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      veganLevel: props.veganLevel
    };
  }

  veganLevelText() {
    var veganLevel = VEGAN_LEVELS[Math.round(this.props.veganLevel)];
    return (
      <View>
        <Slider
          onSlidingComplete={this.props.onSlidingComplete}
          onValueChange={(veganLevel) => this.setState({ veganLevel })}
          minimumTrackTintColor={COLOURS.GREEN}
          value={this.props.veganLevel}
          minimumValue={1}
          maximumValue={5}
        />
        <Text style={[styles.veganLevelText, {fontWeight: 'bold'}]}>{veganLevel.short}</Text>
        <Text style={styles.veganLevelText}>{veganLevel.long}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        { this.veganLevelText() }
      </View>
    );
  }
}

/*  componentDidMount() {
    this.slider.value = this.props.veganLevel;
  }

  render() {
    return (
      <View style={styles.container}>
        <Slider
          onChange={(veganLevel) => {
            this.props.onSlidingComplete(veganLevel);
          }}
          thumbRadius={15}
          lowerTrackColor={COLOURS.GREEN}
          ref={(s) => this.slider = s}
          min={1}
          max={5}
        />
        { this.veganLevelText() }
      </View>
    );
  }
}   */

var styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    //borderColor: 'red',
    //borderWidth: 2,
  },

  veganLevelText: {
    textAlign: 'center',
    color: COLOURS.GREY,
    paddingBottom: 5,
  }
});

VeganLevelSlider.propTypes = {
  onSlidingComplete: React.PropTypes.func.isRequired,
  veganLevel: React.PropTypes.number.isRequired
};

module.exports = VeganLevelSlider;
