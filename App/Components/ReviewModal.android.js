'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  TextInput,
  View,
  Image,
  ToastAndroid,
  TouchableOpacity
} = React;

var Button = require('./Button');
var Reviews = require('../Utils/Reviews');
var COLOURS = require('../Constants/Colours');

class Stars extends React.Component {
  getStarIcon(num) {
    return num <= this.props.stars ? require('image!ic_star_black_24dp') : require('image!ic_star_border_black_24dp');
  }
  render() {
    return (
      <View style={styles.stars}>
        <TouchableOpacity onPress={this.props.handler.bind(this, 1)}>
          <Image style={styles.star} source={this.getStarIcon(1)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 2)}>
          <Image style={styles.star} source={this.getStarIcon(2)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 3)}>
          <Image style={styles.star} source={this.getStarIcon(3)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 4)}>
          <Image style={styles.star} source={this.getStarIcon(4)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 5)}>
          <Image style={styles.star} source={this.getStarIcon(5)} />
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
      <View style={styles.container}>
        <Text style={styles.headerText}>What did you think of {this.props.name}?</Text>
        <Stars stars={this.state.stars} handler={this._onPressStars.bind(this)} />
        <Text style={styles.starsText}>{this.state.stars} Stars</Text>
        <TextInput
          placeholder='Your review'
          onSubmitEditing={this._onLeaveReview.bind(this)}
          textAlignVertical='top'
          style={styles.reviewForm}
          onChangeText={this._onChangeText.bind(this)}
          value={this.state.reviewText}
          multiline />
        <View style={{alignItems: 'center'}}>
          <Button color={this.getButtonColour()} onPress={this._onLeaveReview.bind(this)}>Leave your review </Button>
        </View>
      </View>
    );
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  reviewForm: {
    height: 50,
    fontSize: 16,
    backgroundColor: 'f8f8f8',
    marginTop: 10,
    marginBottom: 10,
    padding: 2
  },
  headerText: {
    color: COLOURS.GREY,
    textAlign: 'center',
    fontSize: 20
  },
  star: {
    width: 24,
    height: 24
  },
  stars: {
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  starsText: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLOURS.GREY
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
