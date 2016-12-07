'use strict';

// TODO: Remove completely.

class GoogleAnalytics {
  constructor() {
    this.ga = {
      send() {} // No-op to begin with.
    };
  }

  viewedScreen(screenName) {
  }

  trackEvent(eventCategory, eventAction, eventLabel) {
  }

  trackError(message, fatal) {
  }
}

module.exports = new GoogleAnalytics();
