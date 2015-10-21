'use strict';

var React = require('react-native');

var {
  View,
  TextInput
} = React;

class SearchBox extends React.Component {
  render() {
    return (
      <View style={{height: 56, backgroundColor: 'white'}}>
        <TextInput 
          style={{height: 40, backgroundColor: '#f8f8f8', borderRadius: 11, paddingLeft: 10, margin: 8}}
          placeholder='Search for something'
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          autoCorrect={false}
          autoCapitalize='none'
          onFocus={this.props.onFocus}
          onBlur={this.props.onFocus}
          returnKeyType='search'
         /> 
       </View>
    );
  }
}

SearchBox.propTypes = {
  onSubmitEditing: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired,
  onFocus: React.PropTypes.func.isRequired,
  onChangeText: React.PropTypes.func.isRequired
};

module.exports = SearchBox;
