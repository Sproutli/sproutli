'use strict';
/* @flow */

import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native';
import React from 'react';

let LoadingScreen = (props) => {
  return (
    <View style={styles.background}>
      <ActivityIndicator size='large' />
      <Text style={{marginTop: 16}}>{props.children}</Text>  
    </View>
  );
};

var styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

module.exports = LoadingScreen;
