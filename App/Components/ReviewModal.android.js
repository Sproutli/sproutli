'use strict';

import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  View,
  Image,
  PixelRatio,
  ToastAndroid,
  TouchableOpacity
} from 'react-native';

var Icon = require('react-native-vector-icons/Ionicons');

var Button = require('./Button');
var Reviews = require('../Utils/Reviews');
var COLOURS = require('../Constants/Colours');
var pixelRatio = PixelRatio.get();

class Stars extends React.Component {
  getStarIcon(num) {
    return num <= this.props.stars ? 'ios-star' : 'ios-star-outline';
  }
  render() {
    const starSize = pixelRatio == 3 ? 50 : 25;
    return (
      <View style={styles.stars}>
        <TouchableOpacity onPress={this.props.handler.bind(this, 1)}>
          <Icon name={this.getStarIcon(1)} size={starSize} color={COLOURS.GREEN} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 2)}>
          <Icon name={this.getStarIcon(2)} size={starSize} color={COLOURS.GREEN} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 3)}>
          <Icon name={this.getStarIcon(3)} size={starSize} color={COLOURS.GREEN} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 4)}>
          <Icon name={this.getStarIcon(4)} size={starSize} color={COLOURS.GREEN} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 5)}>
          <Icon name={this.getStarIcon(5)}size={starSize} color={COLOURS.GREEN} />
        </TouchableOpacity>
      </View>
    );
  }

}

class ReviewModal extends React.Component {
  constructor() {
    super();
    this.state = {
      reviewText: '',
      stars: 0,
      sending: false
    };
  }

  _onChangeText(reviewText) {
    this.setState( { reviewText });
  }

  _onPressStars(value) {
    this.setState( { stars: value });
  }

  _onLeaveReview() {
    if ( this.state.sending || this.state.reviewText.length < 1 ) return;
    this.setState({ sending: true });

    var review = {
      content: this.state.reviewText,
      listing_id: this.props.listingID,
      rating: this.state.stars
    };

    Reviews.postReview(review)
    .then(() => {
      this.props.navigator.pop();
      this.props.getReviews();
      ToastAndroid.show(`Thanks for your review!`, ToastAndroid.LONG);
    })
    .catch((error) => {
      console.warn('Error posting review', error);
      ToastAndroid.show('Sorry!', 'There was an error posting your review. Please try again', ToastAndroid.LONG);
    });
  }

  getButtonColour() {
    if (this.state.sending || this.state.reviewText.length < 1) {
      return COLOURS.GREY;
    } else {
      return COLOURS.GREEN;
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Stars stars={this.state.stars} handler={this._onPressStars.bind(this)} />
        <Text style={styles.starsText}>{this.state.stars} Stars</Text>
        <TextInput
          autoCapitalize='sentences'
          placeholder={`What did you think of ${this.props.name}?`}
          onSubmitEditing={this._onLeaveReview.bind(this)}
          textAlignVertical='top'
          underlineColorAndroid={COLOURS.GREEN}
          style={styles.reviewForm}
          onChangeText={this._onChangeText.bind(this)}
          value={this.state.reviewText}
          multiline />
        <View style={{alignItems: 'center'}}>
          <Button color={this.getButtonColour()} onPress={this._onLeaveReview.bind(this)}>Leave your review </Button>
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    padding: 10
  },
  reviewForm: {
    height: 100,
    fontSize: pixelRatio === 3 ? 20 : 16,
    marginTop: 10,
    marginBottom: 10,
    padding: 7,
    borderRadius: 4,
    borderColor: '#cccccc',
    borderWidth: 1,
    textAlignVertical: "top"
  },
  headerText: {
    color: COLOURS.GREY,
    textAlign: 'center',
    fontSize: pixelRatio === 3 ? 20 : 16,
  },
  stars: {
    paddingTop: 10,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  starsText: {
    fontSize: pixelRatio === 3 ? 20 : 16,
    textAlign: 'center',
    color: COLOURS.GREY
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row'
  }
});

ReviewModal.propTypes = {
  listingID: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.object.isRequired,
  getReviews: React.PropTypes.func.isRequired
};

Stars.propTypes = {
  handler: React.PropTypes.func.isRequired,
  stars: React.PropTypes.number.isRequired
};

module.exports = ReviewModal;
