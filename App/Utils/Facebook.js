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
    FBSDKLoginManager.logInWithReadPermissions([], (error, result) => {
      if (error || result.isCancelled) {
        reject(error || new Error('Login was cancelled'));
      } else {
        resolve(result);
      }
    });
  });
}

function postListing(listing, image) {
  var openGraphObject = new FBSDKShareOpenGraphObject({
    "og:type": {type: "string", value: "sproutli_app:listing"},
    "og:url": {type: "url", value: `https://fb.me/1217622468253450?listingID=${listing.id}`}, 
    "og:title": {type: "string", value: listing.name},
    "og:rich_attachment": {type: "boolean", value: true},
    "og:description": {type: "string", value: listing.description},
    "sproutli_app:locality": {type: "string", value: listing.locality},
    "sproutli_app:state": {type: "string", value: listing.administrative_area_level_1}
  });

  if (image) {
    var photo = new FBSDKSharePhoto(image, false);
    openGraphObject.setPhoto(photo, 'og:image');
  }


  var openGraphAction = new FBSDKShareOpenGraphAction("sproutli_app:create");
  openGraphAction.setObject(openGraphObject, "sproutli_app:listing");

  var openGraphContent = new FBSDKShareOpenGraphContent(openGraphAction, "sproutli_app:listing");

  FBSDKShareDialog.setShouldFailOnDataError(true);

  return new Promise((resolve, reject) => {
    console.log('[Facebook] - About to share content.', openGraphContent);
    FBSDKShareDialog.setContent(openGraphContent);
    FBSDKShareDialog.show((error, result) => {
      console.log('[Facebook] - Showed dialog (apparently)', result);
      if (error || result.isCancelled) {
        reject(error || new Error('Share dialog was cancelled.'));
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
    FBSDKLoginManager.logOut();
    return postListing(listing, image);
  }
}

module.exports = Facebook;
