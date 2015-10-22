/* global fetch */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  PixelRatio,
  TextInput,
  AlertIOS
} = React;

var COLOURS = require('../Constants/Colours');
var Button = require('./Button');
var pixelRatio = PixelRatio.get();

class Feedback extends React.Component {
  constructor() {
    super();
    this.state = {
      feedback: '',
      sending: false
    };
  }

  _onChangeText(text) {
    this.setState({ feedback: text });
  }

  _sendToZapier() {
    if ( this.state.sending || this.state.feedback.length < 1 ) return;
    var title, message;
    this.setState({ sending: true });

    fetch('https://zapier.com/hooks/catch/39b1fp/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ feedback: this.state.feedback})
    })
    .then(() => {
      title = 'Thanks!';
      message = `We'll get back to you shortly.`;
    })
    .catch((error) => {
      console.warn('Error sending feedback to Zapier', error);
      title = 'Error';
      message = 'Sorry! There was an error - please try again.';
    })
    .then(() => {
      this.setState({ sending: false, feedback: '' });
      AlertIOS.alert(title, message);
    });
  }

  getButtonColour() {
    if (this.state.sending || this.state.feedback.length < 1) {
      return COLOURS.GREY;
    } else {
      return COLOURS.GREEN;
    }
  }

  render() {
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps={false}>
        <View style={styles.instructions}>
          <Text style={styles.headerText}>Thanks for using Sproutli!</Text>

          <Text style={styles.instructionText}>Have a burning question? Are we missing an awesome business? Did we screw something up?</Text>
          <Text style={styles.instructionText}>Fill out the form below and get back to you by email.</Text>

          <Text style={[styles.instructionText, {fontWeight: 'bold'}]}>Your thoughts:</Text>
        </View>
        <TextInput 
          onChangeText={this._onChangeText.bind(this)} 
          multiline
          value={this.state.feedback} 
          style={styles.feedbackForm} 
          placeholder='Tell us what you think!'
        />
        <Button color={this.getButtonColour()} onPress={this._sendToZapier.bind(this)}>
          Send Feedback 
        </Button>
      </ScrollView>
    );
  }
}

var styles= StyleSheet.create({
  container: {
    flex: 1,
    top: 32,
    padding: 12
  }, 
  headerText: {
    color: COLOURS.GREY,
    fontSize: pixelRatio * 10
  },

  instructionText: {
    color: COLOURS.GREY,
    fontSize: pixelRatio === 3 ? 20 : 14,
    marginTop: 24
  },
  feedbackForm: {
    height: 100,
    fontSize: 16,
    backgroundColor: COLOURS.LIGHT_GREY,
    padding: 2
  }
});

module.exports = Feedback;
