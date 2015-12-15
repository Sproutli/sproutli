/*global fetch*/
'use strict';

var { 
  AsyncStorage,
  NativeModules 
} = require('react-native');
var ImageUploader = NativeModules.ImageUploader;
var JWTDecode = require('jwt-decode');
var listingWithImages = {};
var Slack = require('../Utils/Slack');
var Users = require('../Utils/Users');
var Intercom = require('../Utils/Intercom');
var GoogleAnalytics = require('../Utils/GoogleAnalytics');
var Moment = require('moment');

function uploadImages(listing) {
  listingWithImages = listing;
  console.log('[CreateListing] - Uploading images:', listing.images);
  return Promise.all(listing.images.map(uploadImage));
}

function uploadImage(image, index) {
  return ImageUploader.uploadImage(`file://${image.uri}`)
  .then((imageName) => {
    listingWithImages.images[index] = `https://s3-ap-southeast-2.amazonaws.com/sproutli-images/${imageName}`; 
  });
}

function postToSlack(listing) {
  return Users.fetchUser()
  .then((user) => {
    var message = `Hey @kane.rogers and @brian: ${user.name} (${user.email}) just created the listing *${listing.name}* using the app. Check it out: http://listingmanager.sproutli.com/#listing/${listing.id}`;
    return Slack.postMessage(message);
  })
  .then(() => listing);
}

function addAnalytics(listing) {
  Intercom.logEvent('created_listing', { listingID: listing.id, listingName: listing.name });
  GoogleAnalytics.trackEvent('Listing', 'Create', listing.id);

  return listing;
}

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

function parseJSON(response) {
  return response.json();
}

function createListing(token) {
  return Users.fetchUser()
  .then((user) => {
    listingWithImages.created_by = user.id;
    listingWithImages.created_at = Moment().toISOString(); 

    return listingWithImages;
  })
  .then((listing) => {
    return fetch('http://sproutli-staging.elasticbeanstalk.com/api/v1/listing', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listing)
    });
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(postToSlack)
  .then(addAnalytics);
}

var CreateListing = {
  create(listing) {
    return uploadImages(listing)
    .then(() => AsyncStorage.getItem('token'))
    .then(createListing);
  }
};

module.exports = CreateListing;
