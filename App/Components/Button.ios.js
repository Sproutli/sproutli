'use strict';

import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  PixelRatio,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

var pixelRatio = PixelRatio.get();

var COLOURS = require('../Constants/Colours');

const Button = ({ color, onPress, children }) => (
  <TouchableOpacity onPress={onPress} underlayColor={COLOURS.LIGHT_GREY}>
    <View style={styles.container}>
      <Text style={[styles.buttonText, { color }]}>{children}</Text>
      <Icon name='ios-arrow-forward' size={25} color={color} />
    </View>
  </TouchableOpacity>
);

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

export default Button;
