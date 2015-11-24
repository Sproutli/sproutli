/*global fetch*/
'use strict';

var AsyncStorage = require('react-native').AsyncStorage;
var JWTDecode = require('jwt-decode');

function checkStatus(response) {
  console.log('[CreateListing] Response: ', response);
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    console.warn('[CreateListing] - Error creating listing', error);
    error.response = response
    throw error
  }
}

var CreateListing = {
  create(listing) {
    return AsyncStorage.getItem('token')
    .then((token) => {
      fetch('http://sproutli-staging.elasticbeanstalk.com/api/v1/listing', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(listing)
      })
      .then(checkStatus);
    });
  }
};

module.exports = CreateListing;
