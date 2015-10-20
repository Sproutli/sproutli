'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  TextInput,
  View,
  AlertIOS,
  TouchableHighlight
} = React;
var Reviews = require('../Utils/Reviews');

class Stars extends React.Component {
  render() {
    return (
      <View style={styles.stars}>
        <TouchableHighlight onPress={this.props.handler.bind(this, 1)}>
          <Text>1 Star</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.handler.bind(this, 2)}>
          <Text>2 Star</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.handler.bind(this, 3)}>
          <Text>3 Star</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.handler.bind(this, 4)}>
          <Text>4 Star</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.handler.bind(this, 5)}>
          <Text>5 Star</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

class ReviewModal extends React.Component {
  constructor() {
    super();
    this.state = {
      reviewText: '',
      stars: 0
    };
  }

  _onChangeText(reviewText) {
    this.setState( { reviewText });
  }

  _onPressStars(value) {
    this.setState( { stars: value });
  }

  _onLeaveReview() {
    var review = {
      content: this.state.reviewText,
      listing_id: this.props.listingID,
      rating: this.state.stars
    };

    Reviews.postReview(review)
      .then(() => {
        AlertIOS.alert(
          'Thanks!', 
          `Thanks for reviewing ${this.props.name}.`,
          [
            { text: 'OK', onPress: () => this.props.navigator.pop() }
          ]
        );
      })
      .catch((error) => {
        console.warn('Error posting review', error);
        AlertIOS.alert('Sorry!', 'There was an error posting your review. Please try again');
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Leave a review for {this.props.name} </Text>
        <Stars handler={this._onPressStars.bind(this)} />
        <Text>{this.state.stars}</Text>
        <TextInput
          style={styles.reviewForm}
          onChangeText={this._onChangeText.bind(this)}
          value={this.state.reviewText}
          multiline />
        <TouchableHighlight onPress={this._onLeaveReview.bind(this)}>
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
  },
  stars: {
    flexDirection: 'row'
  }
});

ReviewModal.propTypes = {
  listingID: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.object.isRequired
};

Stars.propTypes = {
  handler: React.PropTypes.func.isRequired
};

module.exports = ReviewModal;
