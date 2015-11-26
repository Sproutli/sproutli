'use strict';

var API_TOKEN = 'xoxp-2908237029-4578749654-15367711379-dbf559527c';
var QueryString = require('query-string');

function checkStatus(response) {
  console.log('[Slack] Response: ', response);
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    console.warn('[Slack] - Error posting to Slack', error);
    error.response = response
    throw error
  }
}

var Slack = {
  postMessage(content) {
    var query = {
      token: API_TOKEN,
      channel: '#sales',
      text: content,
      username: 'Sproutli API',
      parse: 'full',
      icon_url: 'http://www.sproutli.com/images/leaf.png'
    };

    var queryString = QueryString.stringify(query);

    console.log(`Posting to Slack`, queryString);
    return fetch(`https://slack.com/api/chat.postMessage?${queryString}`)
      .then(checkStatus);
  }
};

module.exports = Slack;
