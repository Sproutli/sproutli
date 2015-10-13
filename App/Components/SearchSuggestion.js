'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var {
  TextInput,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = React;

class SearchSuggestion extends React.Component {
  render() {
    return (
      <TouchableHighlight 
        style={styles.container} 
        underlayColor='#eee'
        onPress={this.props.handler}>

        <View style={styles.container}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{this.props.label}</Text>
          </View>
          <View style={styles.icon}>
            <Text style={styles.iconText}>Icon</Text>
          </View>
        </View>

      </TouchableHighlight>
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
    flexDirection: 'row'
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
  }
});

module.exports = SearchSuggestion;
