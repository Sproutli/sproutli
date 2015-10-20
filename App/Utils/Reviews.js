/*global fetch */
'use strict';

var AsyncStorage = require('react-native').AsyncStorage;
var Moment = require('moment');
var JWTDecode = require('jwt-decode');

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
        console.log('Got reviews', reviews);
        return Promise.all(reviews.map((review) => {
          return fetch(
            `http://sproutli-staging.elasticbeanstalk.com/api/v1/user/${review.user_id}`,
            makeConfig()
          ).then((res) => res.json())
          .then((user) => { 
            console.log('Fetched user', user);
            review.user = user;
            return review;
          });
        }));
      });
  },

  postReview(review) {
    console.log('Got review text', review);
    return AsyncStorage.getItem('token')
      .then((token) => {
        jwtToken = token;

        review = setFields(review);
        var config = makeConfig();
        config.method = 'POST';
        config.body = JSON.stringify(review);

        return fetch(
          `http://sproutli-staging.elasticbeanstalk.com/api/v1/review`,
          config
        );
      });
  }
};

module.exports = Reviews;
