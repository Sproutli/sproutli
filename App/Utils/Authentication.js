'use strict';

var AsyncStorage = require('react-native').AsyncStorage;

var Authentication = {
  login: (credentials) => {
    return fetch('http://sproutli-staging.elasticbeanstalk.com/api/v1/login', {
      body: JSON.stringify(credentials),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      } 
    })
    .then((res) => res.json())
    .then((login) => {
      return AsyncStorage.setItem('token', login.token)
    })
  }
}

module.exports = Authentication;
