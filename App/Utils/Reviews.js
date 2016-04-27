/*global fetch */
'use strict';

var AsyncStorage = require('react-native').AsyncStorage;
var Moment = require('moment');
var JWTDecode = require('jwt-decode');
var Intercom = require('../Utils/Intercom');

import { NativeModules } from 'react-native';
let AnswersReporter = NativeModules.AnswersReporter;

var jwtToken;

var makeConfig = () => {
  return {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  }; 
};

var setFields = (review) => {
  var decodedToken = JWTDecode(jwtToken);
  var userID = decodedToken.UserID;

  review.user_id = userID;
  review.created = Moment().toISOString();

  return review;
};

var Reviews = {
  getReviewsForListing(listingID) {
    return AsyncStorage.getItem('token')
      .then((token) => {
        jwtToken = token;

        return fetch(
          `http://sproutli-staging.elasticbeanstalk.com/api/v1/review?index=listing_id&listing_id=${listingID}`,
          makeConfig()
        );
      })
      .then((res) => res.json())
      .then((reviews) => {
        return Promise.all(reviews.map((review) => {
          return fetch(
            `http://sproutli-staging.elasticbeanstalk.com/api/v1/user/${review.user_id}`,
            makeConfig()
          ).then((res) => res.json())
          .then((user) => { 
            review.user = user;
            return review;
          });
        }));
      });
  },

  postReview(review) {
    return AsyncStorage.getItem('token')
      .then((token) => {
        jwtToken = token;
        review = setFields(review);

        var config = makeConfig();
        config.method = 'POST';
        config.body = JSON.stringify(review);

        Intercom.logEvent('reviewed_listing', { listingId: review.listing_id });
        // TODO: Track in Answers. Need the listing name.

        return fetch(
          `http://sproutli-staging.elasticbeanstalk.com/api/v1/review`,
          config
        );
      });
  }
};

module.exports = Reviews;
