'use strict';
/* @flow */

var React = require('react-native');
var Overlay = require('react-native-overlay');
var BlurView = require('react-native-blur').BlurView;

var {
  Text,
  View,
  ActivityIndicatorIOS,
  StyleSheet,
} = React;

var { width, height } = require('Dimensions').get('window');

var LoadingScreen = React.createClass({
  getDefaultProps(): StateObject {
    return {
      isVisible: false
    }
  },

  render(): ReactElement {
    return (
      <Overlay isVisible={this.props.isVisible}>
        <BlurView style={styles.background} blurType="light">
          <ActivityIndicatorIOS
            size="large"
            animating={true}
            style={styles.spinner} />
          <Text style={{marginTop: 16}}>Creating your listing..</Text>  
        </BlurView>
      </Overlay>
    );
  }
});

var styles = StyleSheet.create({
  background: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

module.exports = LoadingScreen;
