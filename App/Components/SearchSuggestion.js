'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = React;
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var boxWidth = windowSize.width / 2;

var COLOURS = require('../Constants/Colours');

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
            <Icon name={this.props.icon} size={60} color={COLOURS.GREEN} />
          </View>
        </View>

      </TouchableHighlight>
    );
  }
}

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
    fontSize: 30,
    color: COLOURS.GREY,
    textAlign: 'right'
  },
  icon: {
    flex: 1,
    marginLeft: 10,
    width: boxWidth
  }
});

SearchSuggestion.propTypes = {
  handler: React.PropTypes.func.isRequired,
  label: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired
};

module.exports = SearchSuggestion;
