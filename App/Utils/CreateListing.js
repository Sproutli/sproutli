/*global fetch*/
'use strict';

import { 
  AsyncStorage,
  NativeModules, 
  Platform,
} from 'react-native';
let { AnswersReporter, ImageUploader } = NativeModules;
let JWTDecode = require('jwt-decode');
let listingWithImages = {};
let Slack = require('../Utils/Slack');
let Users = require('../Utils/Users');
let Intercom = require('../Utils/Intercom');
let GoogleAnalytics = require('../Utils/GoogleAnalytics');
let Moment = require('moment');

function uploadImages(listing) {
  listingWithImages = listing;
  console.log('[CreateListing] - Uploading images:', listing.images);
  return Promise.all(listing.images.map(uploadImage));
}

function uploadImage(image, index) {
  var imagePath = (Platform.OS === 'ios') ? `file://${image.uri}` : image.uri.replace('file://', '');
  console.log('[CreateListing] - Uploading image: ', imagePath);
  return ImageUploader.uploadImage(imagePath)
  .then((imageName) => {
    console.log('[CreateListing] - Image uploaded: ', imageName);
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
  AnswersReporter.reportCreateListing(listing.name, listing.categories[0]);

  return listing;
}

function checkStatus(response) {
  console.log('[CreateListing] Response: ', response);
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(`Error creating listing. We received a ${response.status} from the server. The user's listing was ${JSON.stringify(listingWithImages)}.`);
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
    throw new Error('Everything is truly fucked');
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
