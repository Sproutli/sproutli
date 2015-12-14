'use strict';

// Facebook

var {
  FBSDKShareAPI,
  FBSDKShareDialog,
  FBSDKShareLinkContent,
  FBSDKShareOpenGraphContent,
  FBSDKShareOpenGraphAction,
  FBSDKSharePhoto,
  FBSDKShareOpenGraphObject
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

function postListing(listing, image) {
  var photo = new FBSDKSharePhoto(image, false);
  var openGraphObject = new FBSDKShareOpenGraphObject({
    "og:type": {type: "string", value: "sproutli_app:listing"},
    "og:url": {type: "url", value: `https://fb.me/1217622468253450?listingID=${listing.id}`}, 
    "og:title": {type: "string", value: listing.name},
    "og:rich_attachment": {type: "boolean", value: true},
    "og:description": {type: "string", value: listing.description},
    "sproutli_app:locality": {type: "string", value: listing.locality},
    "sproutli_app:state": {type: "string", value: listing.administrative_area_level_1}
  });

  openGraphObject.setPhoto(photo, 'og:image');


  var openGraphAction = new FBSDKShareOpenGraphAction("sproutli_app:create");
  openGraphAction.setObject(openGraphObject, "sproutli_app:listing");

  var openGraphContent = new FBSDKShareOpenGraphContent(openGraphAction, "sproutli_app:listing");

  FBSDKShareDialog.setMode('native');
  FBSDKShareDialog.setShouldFailOnDataError(true);

  return new Promise((resolve, reject) => {
    console.log('[Facebook] - About to share content.', openGraphContent);
    FBSDKShareDialog.show(openGraphContent, (error, result) => {
      console.log('[Facebook] - Showed dialog (apparently)', result);
      if (error || result.isCancelled) {
        reject(error || new Error('Login was cancelled'));
      } else {
        resolve(result);
      }
    });
  });
}

function checkToken() {
  return new Promise((resolve) => {
    FBSDKAccessToken.getCurrentAccessToken((token) => {
      resolve(token);
    });
  });
}

var Facebook = {
  shareListing(listing, image) {
    return checkToken()
    .then((token) => {
      if (token) {
        return postListing(listing, image);
      } else {
        return login()
        .then(() => postListing(listing, image));
      }
    });
  }
}

module.exports = Facebook;
