'use strict';

var { AsyncStorage } = require('react-native');

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    console.warn('[ListingFetcher] - Error fetching listing', error);
    error.response = response
    throw error
  }
}

var ListingFetcher = {
  fetch(listingID) {
    console.log('Fetching listing ID: ', listingID);
    return AsyncStorage.getItem('token')
    .then((token) => {
      return fetch(`http://sproutli-staging.elasticbeanstalk.com/api/v1/listing/${listingID}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
    })
    .then(checkStatus)
    .then((res) => res.json());
  }
}

module.exports = ListingFetcher;
