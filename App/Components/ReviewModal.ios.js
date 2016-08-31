'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  PixelRatio,
  AlertIOS,
  TouchableOpacity
} = React;

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
        AlertIOS.alert(
          'Thanks!', 
          `Thanks for reviewing ${this.props.name}.`,
          [
            { text: 'OK', onPress: () => { 
              this.props.navigator.pop();
              this.props.getReviews();
            }}
          ]
        );
      })
      .catch((error) => {
        console.warn('Error posting review', error);
        AlertIOS.alert('Sorry!', 'There was an error posting your review. Please try again');
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
      <ScrollView style={styles.container} keyboardDismissMode='on-drag'>
        <Stars stars={this.state.stars} handler={this._onPressStars.bind(this)} />
        <Text style={styles.starsText}>{this.state.stars} Stars</Text>
        <TextInput
          placeholder={`What did you think of ${this.props.name}?`}
          style={styles.reviewForm}
          onChangeText={this._onChangeText.bind(this)}
          value={this.state.reviewText}
          multiline />
        <View style={styles.buttonContainer}>
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
