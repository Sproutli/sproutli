'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  Text
} = React;

var Moment = require('moment');

class Review extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={[this.props.style, styles.bold]}>{this.props.rating} / 5 </Text>
        <Text style={this.props.style}>{this.props.user.name} ({Moment(this.props.created).format('DD/MM/YYYY')})</Text>

        <Text style={this.props.style}>{this.props.content}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10
  },

  horizontal: {
    flexDirection: 'row'
  },
  
  bold: {
    fontWeight: 'bold',
    paddingBottom: 0
  }
});

Review.propTypes = {
  rating: React.PropTypes.number.isRequired,
  user: React.PropTypes.object.isRequired,
  content: React.PropTypes.string.isRequired,
  created: React.PropTypes.string.isRequired,
  style: Text.propTypes.style.isRequired
};

module.exports = Review;
