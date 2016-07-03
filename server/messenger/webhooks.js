'use strict';

var WEBHOOK_VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN;
var msg = require('./events');

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

  app.post('/webhook', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(function(pageEntry) {
        var pageID = pageEntry.id;
        var timeOfEvent = pageEntry.time;

        // Iterate over each messaging event
        pageEntry.messaging.forEach(function(messagingEvent) {
          if (messagingEvent.optin) {
            msg.receivedAuthentication(messagingEvent);
          } else if (messagingEvent.message) {
            msg.receivedMessage(messagingEvent);
          } else if (messagingEvent.delivery) {
            msg.receivedDeliveryConfirmation(messagingEvent);
          } else if (messagingEvent.postback) {
            msg.receivedPostback(messagingEvent);
          } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
          }
        });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know you've 
      // successfully received the callback. Otherwise, the request will time out.
      res.sendStatus(200);
    }
  });
};