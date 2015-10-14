'use strict';

var React = require('react-native');

var {
  TextInput
} = React;

class SearchBox extends React.Component {
  render() {
    return (
      <TextInput 
        style={{height: 40, borderColor: '#999', borderWidth: 0.2, paddingLeft: 10}}
        placeholder="Search for something"
        onChangeText={this.props.onChangeText}
        onSubmitEditing={this.props.onSubmitEditing}
        autoCorrect={false}
        autoCapitalize='none'
        returnKeyType='search'
       /> 
    );
  }
};

SearchBox.propTypes = {
  onSubmitEditing: React.PropTypes.func.isRequired,
  onChangeText: React.PropTypes.func.isRequired
};

module.exports = SearchBox;
