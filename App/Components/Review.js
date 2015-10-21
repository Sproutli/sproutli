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
        <Text style={[this.props.style, styles.bold]}>Rating</Text>
        <Text style={this.props.style}>{this.props.rating} / 5 </Text>

        <Text style={[this.props.style, styles.bold]}>Reviewer</Text> 
        <Text style={this.props.style}>{this.props.user.name}</Text>
        
        <Text style={[this.props.style, styles.bold]}>Date</Text> 
        <Text style={this.props.style}>{Moment(this.props.created).format('DD/MM/YYYY')}</Text>

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
