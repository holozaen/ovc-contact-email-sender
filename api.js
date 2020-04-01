//  curl -v -X POST https://so55f4it4d.execute-api.eu-central-1.amazonaws.com/dev/email --data 'email=user@example.org&message=my message&subject=My subject'
const ApiBuilder = require('claudia-api-builder'),
api = new ApiBuilder();
const aws = require('aws-sdk');
const ses = new aws.SES({
  region: 'eu-central-1'
});
module.exports = api;

api.corsHeaders('Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Api-Version');
api.corsOrigin(process.env.cors)

api.post('/email', function (req) {
  let msg = ''
  for (let key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      msg += key + ': ' + req.body[key] + '\n'
    }
  }

  let email = { Source: process.env.to, Destination: { ToAddresses: [ process.env.to ] },
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
