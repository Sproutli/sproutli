'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  SliderIOS
} = React;

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
    var veganLevel = VEGAN_LEVELS[Math.round(this.state.veganLevel)];
    return (
      <View>
        <Text style={[styles.veganLevelText, {fontWeight: 'bold'}]}>{veganLevel.short}</Text>
        <Text style={styles.veganLevelText}>{veganLevel.long}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SliderIOS 
          onSlidingComplete={this.props.onSlidingComplete} 
          onValueChange={(veganLevel) => this.setState({ veganLevel })}
          minimumTrackTintColor={COLOURS.GREEN}
          value={this.props.veganLevel} 
          minimumValue={1} 
          maximumValue={5} 
        />
        { this.veganLevelText() }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10
  },

  veganLevelText: {
    color: COLOURS.GREY
  }
});

VeganLevelSlider.propTypes = {
  onSlidingComplete: React.PropTypes.func.isRequired,
  veganLevel: React.PropTypes.number.isRequired
};

module.exports = VeganLevelSlider;
