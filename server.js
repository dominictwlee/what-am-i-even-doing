var fs = require('fs')
var path = require('path');
var express = require('express');
// var yelpService = require('./server/yelp');
var env = fs.existsSync('./env.js')? require('./env') : process.env

var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  token: env.token,
  token_secret: env.token_secret,
});

var app = express();

app.use(express.static('public'));

app.get('/api/search', function (req, res) {
  var term = req.query.term;
  var location = req.query.location;

  if (!term || !location) {
    res.json({
      error: 'You must include a term and a location!'
    });
  }

  yelp.search({ term: term, location: location })
    .then(function (data) {
      res.json(data);
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// app.get('/config', function (req, res) {
//   res.sendFile(path.join(__dirname, 'config.html'));
// });

app.listen(process.env.PORT||3000, function() {
  console.log('listening at localhost:3000');
});
