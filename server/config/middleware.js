'use strict';

var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');

var APP_SECRET = process.env.MESSENGER_APP_SECRET;
var WEBHOOK_VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN;
var PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN;

module.exports = function(app, express) {

  app.use(bodyParser.urlencoded({
  extended: true
  }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.static(__dirname +  '/../../client'));

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

  app.get('/', function(req, res){
    res.status(200).send('Hello world');
  });
};