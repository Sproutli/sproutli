/*global fetch */
'use strict';

var AsyncStorage = require('react-native').AsyncStorage;
var baseURL = 'http://sproutli-staging.elasticbeanstalk.com/api/v1';

var Authentication = {
  login: (credentials) => {
    return fetch(`${baseURL}/login`, {
      body: JSON.stringify(credentials),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      } 
    })
    .then((res) => res.json())
    .then((login) => {
      return AsyncStorage.setItem('token', login.token);
    });
  },

  signUp: (credentials) => {
    console.log('Signing up..');
    return fetch(`${baseURL}/signup`, {
      body: JSON.stringify(credentials),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      } 
    })
    .then((res) => res.json())
    .then((signup) => {
      console.log('..done, got signup:', signup);
      credentials.id = signup.id;
      credentials.token = signup.token;
      return AsyncStorage.setItem('token', signup.token);
    })
    .then(() => {
      var user = {
        email: credentials.email,
        id: credentials.id,
        name: credentials.name
      };
      console.log('Creating user..', user);
      return fetch(`${baseURL}/user/${user.id}`, {
        body: JSON.stringify(user),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${credentials.token}`
        } 
      });
    })
    .then((res) => {
      console.log('..done, got response', res);
      res.json();
    });
  }
};

module.exports = Authentication;
