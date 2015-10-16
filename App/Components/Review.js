'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  Text,
} = React;

class Review extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Rating: {this.props.rating} / 5 </Text>
        <Text>Reviewer: {this.props.user.name}</Text>
        <Text>{this.props.content}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10
  }
});

module.exports = Review;
