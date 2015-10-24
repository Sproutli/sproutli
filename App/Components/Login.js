'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var { width } = Dimensions.get('window');
var {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  AlertIOS,
  TextInput
} = React;

var Authentication = require('../Utils/Authentication');
var COLOURS = require('../Constants/Colours');
var pixelRatio = PixelRatio.get();

class Login extends React.Component {
  constructor(props) {
    super();
    this.state = {
      email: props.email,
      password: props.password,
      name: ''
    };
  }

  _onEmailChanged(email) {
    this.setState({ email });
  }

  _onPasswordChanged(password) {
    this.setState({ password });
  }

  _onNameChanged(name) {
    this.setState({ name });
  }

  _loginPressed() {
    var credentials = {
      email: this.state.email,
      password: this.state.password
    };

    Authentication.login(credentials)
      .then(() => this.goToApp())
      .catch((error) => {
        console.warn('[Login] - Error logging in - ', error);
        AlertIOS.alert('Error', 'Sorry, there was an error with your email and password.');
      });
  }

  _signupPressed() {
    if (!this.props.signingUp) {
      // TODO: Copy details to sign up screen.
      this.props.navigator.push({
        name: 'login',
        index: 1,
        signingUp: true,
        email: this.state.email,
        password: this.state.password
      });
    } else {
      var credentials = {
        email: this.state.email,
        password: this.state.password,
        name: this.state.name
      };

      Authentication.signUp(credentials)
        .then(() => this.goToApp())
        .catch((error) => {
          console.warn('[Login] - Error logging in - ', error);
          AlertIOS.alert('Error', 'Sorry, there was an error signing up! Please try again.');
        });
    }
  }

  goToApp() {
    this.props.navigator.replace({
      name: 'app',
      index: 1
    });
  }

  nameField() {
    if (!this.props.signingUp) return <View />;
    return ( 
      <TextInput 
        style={styles.loginInput} 
        returnKeyType='done'
        onSubmitEditing={this._signupPressed.bind(this)}
        onChangeText={this._onNameChanged.bind(this)} 
        placeholder='Your name' 
      />
     );
  }

  loginButton() {
    return this.props.signingUp ? <View /> : <Text style={styles.loginButtons} onPress={this._loginPressed.bind(this)}>Login</Text>;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Welcome to Sproutli!</Text>
            <Text style={styles.subtext}>Let&apos;s get started.</Text>
          </View>
          <TextInput 
            keyboardType='email-address' 
            style={styles.loginInput} 
            placeholder='Email' 
            autoCorrect={false}
            value={this.state.email}
            onChangeText={this._onEmailChanged.bind(this)}
            autoCapitalize='none'
          />
          <TextInput 
            secureTextEntry
            style={styles.loginInput} 
            placeholder='Passsword' 
            value={this.state.password}
            onChangeText={this._onPasswordChanged.bind(this)}
          />
          {this.nameField()}
          <View style={styles.loginButtonsContainer}>
            {this.loginButton()}
            <Text style={styles.loginButtons} onPress={this._signupPressed.bind(this)}>Sign Up</Text>
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
    backgroundColor: '#fff'
  },
  header: {
    marginTop: 50,
    justifyContent: 'center',
    flex: 1
  },
  subtext: {
    fontSize: pixelRatio === 3 ? 20 : 15,
    backgroundColor: '#fff',
    paddingTop: 16,
    color: COLOURS.GREY,
    textAlign: 'center'
  },
  headerText: {
    textAlign: 'center',
    fontSize: pixelRatio === 3 ? 30 : 22,
    color: COLOURS.GREY
  },
  loginContainer: {
    flex: 0.4,
    width
  },
  loginButtonsContainer: {
    flex: 1, 
    justifyContent: 'flex-start', 
    width
  },
  loginButtons: {
    padding: 16,
    fontSize: pixelRatio === 3 ? 25 : 20,
    fontWeight: '400',
    color: COLOURS.GREEN,
    textAlign: 'center'
  },
  loginInput: {
    height: 40, 
    width,
    backgroundColor: COLOURS.LIGHT_GREY,
    margin: 5,
    borderRadius: 5,
    paddingHorizontal: 10
  }
});

Login.propTypes = {
  signingUp: React.PropTypes.bool.isRequired,
  navigator: React.PropTypes.object.isRequired
};

module.exports = Login;
