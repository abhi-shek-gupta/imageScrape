var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;
var bodyParser = require('body-parser');
var jsonparser = require('json-parser');
var mongoose = require('mongoose');
 mongoose.Promise = require('bluebird');

var config = require('./config/config')
var routes = require('./routes/searchandsave')

mongoose.connect(config.mongdburl, { useMongoClient: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes)

app.use(express.static(__dirname + '/public'));
app.use(function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Server started at : ' + PORT);
    }
})