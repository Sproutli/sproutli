'use strict';

var IntercomAPI = require('react-native-intercom');
var Users = require('../Utils/Users');
import { NativeModules } from 'react-native';
let CrashlyticsReporter = NativeModules.CrashlyticsReporter;

var user;

var Intercom = {
  userLoggedIn() {
    console.log('User logged in..');
    return Users.fetchUser()
      .then((fetchedUser) => {
        user = fetchedUser;
        CrashlyticsReporter.identifyUser(user.name || '', user.id, user.email || '');
        return IntercomAPI.registerIdentifiedUser({ userId: user.id });
      })
      .then(() => {
        return IntercomAPI.updateUser({ 
          email: user.email,
          name: user.name
        });
      })
      .then(() => console.log('[Intercom] - Registered user', user))
      .catch((error) => console.warn('[Intercom] - Unable to register user - ', error));
  },

  logEvent(name, metadata) {
    return IntercomAPI.logEvent(name, metadata);
  },

  displayMessageComposer() {
    IntercomAPI.displayMessageComposer();
  }
};

module.exports = Intercom;
