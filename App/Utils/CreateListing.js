/*global fetch*/
'use strict';

var { 
  AsyncStorage,
  NativeModules 
} = require('react-native');
var ImageUploader = NativeModules.ImageUploader;
var JWTDecode = require('jwt-decode');
var listingWithImages = {};

function uploadImage(image, index) {
  return ImageUploader.uploadImage(`file://${image.uri}`, index);
}

function uploadImages(listing) {
  listingWithImages = listing;
  return Promise.all(listing.images.map(uploadImage));
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

var CreateListing = {
  create(listing) {
    return uploadImages(listing)
    // .then(AsyncStorage.getItem('token'))
    // .then((token) => {
    //   fetch('http://sproutli-staging.elasticbeanstalk.com/api/v1/listing', {
    //     method: 'post',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`
    //     },
    //     body: JSON.stringify(listingWithImages)
    //   })
    //   .then(checkStatus);
    // });
  }
};

module.exports = CreateListing;
