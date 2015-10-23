'use strict';

var IntercomAPI = require('react-native-intercom');
var Users = require('../Utils/Users');

var user;

var Intercom = {
  userLoggedIn() {
    Users.fetchUser()
      .then((fetchedUser) => {
        user = fetchedUser;
        return IntercomAPI.registerIdentifiedUser({ userId: user.id });
      })
      .then(() => {
        return IntercomAPI.updateUser({ 
          email: user.email,
          name: user.name
        });
      })
      .then(() => console.log('Registered user', user))
      .catch((error) => console.warn('[Intercom] - Unable to register user - ', error));
  }
};

module.exports = Intercom;
