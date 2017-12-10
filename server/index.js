require('dotenv').config();
var fs = require('fs')
var path = require('path');
var express = require('express');
const Yelp = require("./yelp");
const yelp = new Yelp({ apiKey: process.env.YELP_API_KEY })

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

  yelp.search({ term, location })
    .then(data => {
      return res.json(data);
    })
    .catch((e) => {
      console.error("Error", e);
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});
// app.get('/config', function (req, res) {
//   res.sendFile(path.join(__dirname, 'config.html'));
// });

app.listen(process.env.PORT||3000, function() {
  console.log('listening at localhost:3000');
});
