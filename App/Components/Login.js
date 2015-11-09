'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var { width, height } = Dimensions.get('window');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  PixelRatio,
  ActivityIndicatorIOS,
  AlertIOS,
  TextInput
} = React;

var Authentication = require('../Utils/Authentication');
var Button = require('./Button');
var COLOURS = require('../Constants/Colours');
var pixelRatio = PixelRatio.get();

class Login extends React.Component {
  constructor(props) {
    super();
    this.state = {
      email: props.email,
      password: props.password,
      loading: true,
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
    console.log('Signup pressed');
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
      this.setState({loading: true});
      var credentials = {
        email: this.state.email,
        password: this.state.password,
        name: this.state.name
      };

      Authentication.signUp(credentials)
        .then(() => this.goToApp())
        .catch((error) => {
          this.setState({loading: false});
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

  emailField() {
    if (height === 480 && this.props.signingUp) { return <View />; }
    return (
      <TextInput 
        keyboardType='email-address' 
        style={styles.loginInput} 
        placeholder='Email' 
        autoCorrect={false}
        value={this.state.email}
        onChangeText={this._onEmailChanged.bind(this)}
        autoCapitalize='none'
      />
    );
  }

  passwordField() {
    if (height === 480 && this.props.signingUp) { return <View />; }
    return (
      <TextInput 
        secureTextEntry
        style={styles.loginInput} 
        placeholder='Password' 
        value={this.state.password}
        onChangeText={this._onPasswordChanged.bind(this)}
      />
    );
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
    if (this.props.signingUp) return <View />;
    return (
      <View style={{paddingVertical: 20}}>
        <Button onPress={this._loginPressed.bind(this)}>Login</Button>
      </View>
    );
  }

  render() {
    return (
      <ScrollView containerStyle={styles.container} keyboardShouldPersistTaps={false} keyboardDismissMode='on-drag'>
        <View style={styles.loginContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Welcome to Sproutli!</Text>
            <Text style={styles.subtext}>Let&apos;s get started.</Text>
          </View>
          {this.emailField() }
          {this.passwordField()}
          {this.nameField()}
          <View style={styles.loginButtonsContainer}>
            {this.loginButton()}
            <Button onPress={this._signupPressed.bind(this)}>Sign Up</Button>
            { this.state.loading ? <ActivityIndicatorIOS style={{paddingTop: 10}} /> : <View /> }
          </View>
        </View>
        <View style={{flex: 0.33}}/>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 50,
    justifyContent: 'center',
    flex: 1
  },
  subtext: {
    fontSize: pixelRatio === 3 ? 20 : 15,
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
    alignItems: 'center',
    justifyContent: height === 480 ? 'center' : 'flex-start', 
    flexDirection: height === 480 ? 'row' : 'column',
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
