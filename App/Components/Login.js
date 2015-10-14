'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var { height, width } = Dimensions.get('window');
var {
  StyleSheet,
  Text,
  View,
  TextInput,
  NavigatorIOS,
} = React;

class Login extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Welcome to Sproutli!</Text>
            <Text style={styles.subtext}>Let&apos;s get started.</Text>
          </View>
          <TextInput keyboardType="email-address" style={styles.loginInput} placeholder="Email" />
          <Text />
          <TextInput secureTextEntry={true} style={styles.loginInput} placeholder="Passsword" />
          <Text />
          <View style={styles.loginButtonsContainer}>
            <Text style={styles.loginButtons}>Login</Text>
            <Text style={styles.loginButtons}>Sign Up</Text>
          </View>
        </View>
        <View style={{flex: 0.33}}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    justifyContent: 'center',
    flex: 1
  },
  subtext: {
    fontSize: 20,
    backgroundColor: '#fff',
    paddingTop: 16,
    textAlign: 'center'
  },
  headerText: {
    textAlign: 'center',
    fontSize: 30,
    color: '#5D656C'
  },
  loginContainer: {
    flex: 1,
    width
  },
  loginButtonsContainer: {
    flex: 1, 
    justifyContent: "flex-start", 
    width,
    paddingTop: 32
  },
  loginButtons: {
    padding: 16,
    fontSize: 25,
    fontWeight: '400',
    color: '#3BBD85',
    textAlign: 'center'
  },
  loginInput: {
    height: 40, 
    width,
    paddingLeft: 16, 
    borderColor: '#999', 
    borderWidth: 0.5
  }
});

module.exports = Login;
