'use strict';

var AsyncStorage = require('react-native').AsyncStorage;

var jwtToken;

var makeConfig = () => {
  return {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  }; 
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
              review.user = user
              return review;
            });
        }));
      });
  }
}

module.exports = Reviews;
