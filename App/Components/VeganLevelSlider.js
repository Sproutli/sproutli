'use strict';

var React = require('react-native');
var {
  View,
  Text,
  SliderIOS
} = React;

class VeganLevelSlider extends React.Component{
  render() {
    return (
      <View>
        <SliderIOS 
          onSlidingComplete={this.props.onSlidingComplete} 
          value={this.props.veganLevel} 
          minimumValue={1} 
          maximumValue={5} 
        />
        <Text>{ Math.round(this.props.veganLevel) }</Text>
      </View>
    );
  }
}

module.exports = VeganLevelSlider;
