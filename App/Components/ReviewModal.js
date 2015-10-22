'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
  TextInput,
  View,
  AlertIOS,
  TouchableOpacity
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

var Button = require('./Button');
var Reviews = require('../Utils/Reviews');
var COLOURS = require('../Constants/Colours');

class Stars extends React.Component {
  getStarIcon(num) {
    return num <= this.props.stars ? 'ios-star' : 'ios-star-outline';
  }
  render() {
    return (
      <View style={styles.stars}>
        <TouchableOpacity onPress={this.props.handler.bind(this, 1)}>
          <Icon name={this.getStarIcon(1)} size={50} color={COLOURS.GREEN} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 2)}>
          <Icon name={this.getStarIcon(2)} size={50} color={COLOURS.GREEN} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 3)}>
          <Icon name={this.getStarIcon(3)} size={50} color={COLOURS.GREEN} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 4)}>
          <Icon name={this.getStarIcon(4)} size={50} color={COLOURS.GREEN} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handler.bind(this, 5)}>
          <Icon name={this.getStarIcon(5)}size={50} color={COLOURS.GREEN} />
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
      <View style={styles.container}>
        <Text style={styles.headerText}>What did you think of {this.props.name}?</Text>
        <Stars stars={this.state.stars} handler={this._onPressStars.bind(this)} />
        <Text style={styles.starsText}>{this.state.stars} Stars</Text>
        <TextInput
          style={styles.reviewForm}
          onChangeText={this._onChangeText.bind(this)}
          value={this.state.reviewText}
          multiline />
        <Button color={this.getButtonColour()} onPress={this._onLeaveReview.bind(this)}>Leave your review </Button>
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
    marginTop: 10,
    marginBottom: 10,
    padding: 2
  },
  headerText: {
    color: COLOURS.GREY,
    textAlign: 'center',
    fontSize: 20
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
