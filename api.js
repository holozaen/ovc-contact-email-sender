//  curl -v -X POST https://so55f4it4d.execute-api.eu-central-1.amazonaws.com/dev/email --data 'email=user@example.org&message=my message&subject=My subject'
const ApiBuilder = require('claudia-api-builder'),
api = new ApiBuilder();
const aws = require('aws-sdk');
const ses = new aws.SES({
  region: 'eu-central-1'
});
module.exports = api;

api.post('/email', function (req) {
  var msg = ''
  for (var key in req.post) {
      msg += key + ': ' + req.post[key] + '\n'
  }
  console.log(req.post)

  var email = { Source: process.env.to, Destination: { ToAddresses: [ process.env.to ] },
    Message: { Subject: { Data: process.env.subject }, Body: { Text: { Data: msg } } } }
  return ses.sendEmail(email).promise()
    .then(function (data) {
      return { 'status': 'OK' }
    })
    .catch(function (err) {
      console.log('Error sending mail: ' + err)
      return { 'status': 'ERROR' }
    })
});
