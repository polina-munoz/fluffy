'use strict';

var APP_SECRET = process.env.MESSENGER_APP_SECRET;
var WEBHOOK_VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN;
var PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN;

module.exports = function(app) {

  app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === WEBHOOK_VALIDATION_TOKEN) {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);          
    } 
  });
};