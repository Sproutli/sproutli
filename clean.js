var aws = require('aws-sdk');
var exec = require('child_process').exec;
var client = new aws.DynamoDB.DocumentClient({region: 'ap-southeast-2'});

var listings = [];

function scanAgain(lastEvaluatedKey) {
    client.scan({TableName: 'listing', LastEvaluatedKey: data.LastEvaluatedKey}, (err, data) => {
      listings << data.Items;
      if (data.LastEvaluatedKey) { 
        // TODO.
      }
    });
}

client.scan({TableName: 'listing'}, (err, data) => {
  if (err) { console.log(err); }

  listings << data.Items;
  if (data.LastEvaluatedKey) { 
    console.log('Found LastEvaluatedKey. Scanning again.');
  }
});
