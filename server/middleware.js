'use strict';

var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');

module.exports = function(app, express) {

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.static(__dirname +  '/../client'));

  var messengerRouter = express.Router();

  app.use('/fb', messengerRouter);

  app.get('/', function(req, res){
    res.status(200).send("Hello world, I'm Fluffy the messenger bot.");
  });

  app.get('*', function(req, res){
    res.status('404');
    res.redirect('/');
  });

  require(__dirname + '/messenger/routes.js')(messengerRouter);
};