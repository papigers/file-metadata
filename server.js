var express = require('express');
var path = require('path');
var validUrl = require('valid-url');

var MongoClient = require('mongodb').MongoClient;
var mongourl = process.env.MONGODB_URI || 'mongodb://localhost:27017/imgsrch';

var app = express();

app.set('mongourl', mongourl);
app.use(express.static(path.join(__dirname, 'public')));

var key = process.env.API_KEY || 'AIzaSyCZURzPGXALgz9XZnYYthBSFMgvoj85zYM';
var cx = process.env.SE_ID || '004233682054932017379:nnt19d9btwo';

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
  console.log("Server listening on port: ", app.get('port'));
});