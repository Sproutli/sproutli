'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput
} = React;

class Feedback extends React.Component {
  constructor() {
    super();
    this.state = {
      feedback: ''
    };
  }

  _onChangeText(text) {
    this.setState({ feedback: text });
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
        <TextInput onChangeText={this._onChangeText.bind(this)} multiline={true} style={styles.feedbackForm} placeholder="Tell us what you think!"></TextInput>
        <Text style={[styles.instructionText, {color: 'green'}]}>Send Feedback ></Text>
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
