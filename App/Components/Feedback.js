'use strict';

var Icon = require('react-native-vector-icons/Ionicons');
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  AlertIOS
} = React;

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
    if ( this.state.sending ) return;
    var title, message;
    this.setState({ sending: true });

    console.log('Sending..');

    fetch('https://zapier.com/hooks/catch/39b1fp/', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ feedback: this.state.feedback})
    })
    .then((response) => {
      title = 'Thanks!';
      message = "We'll get back to you shortly.";
    })
    .catch((error) => {
      console.log('Error sending feedback to Zapier', error);
      title = 'Error';
      message = 'Sorry! There was an error - please try again.';
    })
    .then(() => {
      this.setState({ sending: false, feedback: '' });
      AlertIOS.alert(title, message);
    });
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
        <TextInput onChangeText={this._onChangeText.bind(this)} multiline={true} value={this.state.feedback} style={styles.feedbackForm} placeholder="Tell us what you think!"></TextInput>
        <Text style={[styles.instructionText, {color: 'green'}]} onPress={this._sendToZapier.bind(this)}>Send Feedback  <Icon name="chevron-right" size={20} color="green" /></Text>
      </ScrollView>
    );
  }
}

var styles= StyleSheet.create({
  container: {
    flex: 1,
    top: 32,
    padding: 12,
  }, 
  headerText: {
    color: 'grey',
    fontSize: 30
  },
  instructionText: {
    fontSize: 20,
    marginTop: 24
  },
  feedbackForm: {
    height: 100,
    fontSize: 16,
    backgroundColor: 'f8f8f8',
    padding: 2
  }
});

module.exports = Feedback;
