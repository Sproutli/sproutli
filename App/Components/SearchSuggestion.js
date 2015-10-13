'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var {
  TextInput,
  StyleSheet,
  Text,
  View
} = React;

class SearchSuggestion extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.label}>
          <Text style={styles.labelText}>{this.props.label}</Text>
        </View>
        <View style={styles.icon}>
          <Text style={styles.iconText}>Icon</Text>
        </View>
      </View>
    );
  }
}

var windowSize = Dimensions.get('window');
var boxWidth = windowSize.width / 2;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  label: {
    flex: 1,
    width: boxWidth,
    marginRight: 10
  },
  labelText: {
    fontSize: 25,
    textAlign: 'right'
  },
  icon: {
    flex: 1,
    marginLeft: 10,
    width: boxWidth
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = SearchSuggestion;
