'use strict';

var React = require('react-native');
var {
  Text,
  View,
  TouchableHighlight,
  PixelRatio,
  StyleSheet
} = React;

var Icon = require('react-native-vector-icons/Ionicons');
var pixelRatio = PixelRatio.get();

var COLOURS = require('../Constants/Colours');

class Button extends React.Component {
  render() {
    var color = this.props.color || COLOURS.GREEN;

    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor={COLOURS.LIGHT_GREY}>
        <View style={styles.container}>
          <Text style={[styles.buttonText, { color }]}>{this.props.children}</Text>
          <Icon name='chevron-right' size={25} color={color} />
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },

  buttonText: {
    fontSize: pixelRatio === 3 ? 20 : 17,
    paddingRight: 5
  }
});

Button.propTypes = {
  children: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,

  color: React.PropTypes.string
};

module.exports = Button;
