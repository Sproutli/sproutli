'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  TextInput,
  View,
  TouchableHighlight
} = React;

class ReviewModal extends React.Component {
  constructor() {
    super();
    this.state = {
      reviewText: ''
    };
  }

  _onChangeText(reviewText) {
    this.setState( { reviewText });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Leave a review for {this.props.name} </Text>
        <TextInput
          style={styles.reviewForm}
          onChangeText={this._onChangeText.bind(this)}
          value={this.state.reviewText}
          multiline />
        <TouchableHighlight>
          <Text>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
var styles = StyleSheet.create({
  container: {
    marginTop: 64,
    flex: 1,
    padding: 10
  },
  reviewForm: {
    height: 100,
    fontSize: 16,
    backgroundColor: 'f8f8f8',
    padding: 2
  }
});

ReviewModal.propTypes = {
  listingID: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired
};

module.exports = ReviewModal;
