'use strict';

var {
  Analytics,
  Hits: Hits
} = require('react-native-google-analytics');

var Users = require('./Users');

class GoogleAnalytics {
  constructor() {
    this.ga = {
      send() {} // No-op to begin with.
    };
    Users.getUserID().then((userID) => this.ga = new Analytics('UA-66202608-2', userID));
  }

  viewedScreen(screenName) {
    var screenView = new Hits.ScreenView('Sproutli', '2.1', 'com.sproutli.app', null, screenName);
    this.ga.send(screenView);
  }

  trackEvent(eventCategory, eventAction, eventLabel) {
    this.ga.send(new Hits.Event(eventCategory, eventAction, eventLabel));
  }

  trackError(message, fatal) {
    this.ga.send(new Hits.Exception(message, fatal));
  }
}

module.exports = new GoogleAnalytics();
