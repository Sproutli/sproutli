'use strict';
/* @flow */

import { Text, View, ProgressBarAndroid, StyleSheet, ActivityIndicatorIOS, Platform } from 'react-native';
import React from 'react';

let spinner = () => { 
  if (Platform.OS === 'android') {
    return <ProgressBarAndroid styleAttr='Large' />;
  } else {
    return <ActivityIndicatorIOS size='large' />;
  }
}

let LoadingScreen = (props) => {
  return (
    <View style={styles.background}>
      { spinner() }
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
