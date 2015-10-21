/*global fetch */
'use strict';

var AsyncStorage = require('react-native').AsyncStorage;
var JWTDecode = require('jwt-decode');

var Users = {
  fetchUser: () => {
    return AsyncStorage.getItem('token')
    .then((token) => {
      var userID = JWTDecode(token).UserID;
      return fetch(`http://sproutli-staging.elasticbeanstalk.com/api/v1/user/${userID}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        });
    })
    .then((res) => res.json());
  }
};

module.exports = Users;
