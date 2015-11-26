'use strict';

// Facebook

var {
  FBSDKShareAPI,
  FBSDKShareDialog,
  FBSDKShareLinkContent,
} = require('react-native-fbsdkshare');
var { FBSDKLoginManager } = require('react-native-fbsdklogin');
var { FBSDKAccessToken } = require('react-native-fbsdkcore');

function login() {
  return new Promise((resolve, reject) => {
    FBSDKLoginManager.logInWithPublishPermissions(['publish_actions'], (error, result) => {
      if (error || result.isCancelled) {
        reject(error || new Error('Login was cancelled'));
      } else {
        resolve(result);
      }
    });
  });
}

function postListing(listing) {
  var linkContent = new FBSDKShareLinkContent(
    `https://fb.me/1217622468253450?listingID=${listing.id}`, 
    listing.description, 
    `${listing.name} on Sproutli`, 
    listing.images[0]
  );

  return new Promise((resolve, reject) => {
    FBSDKShareAPI.share(linkContent, '/me', `I just added ${listing.name} on Sproutli. Check it out!`, (error, result) => {
      if (error || result.isCancelled) {
        reject(error || new Error('Login was cancelled'));
      } else {
        resolve(result);
      }
    });
  });
}

var Facebook = {
  shareListing(listing) {
    FBSDKAccessToken.getCurrentAccessToken((token) => {
      if (token) {
        postListing(listing);
      } else {
        login()
        .then(() => postListing(listing));
      }
    });
  }
}

module.exports = Facebook;
