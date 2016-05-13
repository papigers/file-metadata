var express = require('express');
var path = require('path');
var validUrl = require('valid-url');
var request = require('request');

var MongoClient = require('mongodb').MongoClient;
var mongourl = process.env.MONGODB_URI || 'mongodb://localhost:27017/imgsrch';

var app = express();

app.set('mongourl', mongourl);
app.use(express.static(path.join(__dirname, 'public')));

var key = 'key=' + (process.env.API_KEY || 'AIzaSyCZURzPGXALgz9XZnYYthBSFMgvoj85zYM');
var cx = 'cx=' + (process.env.SE_ID || '004233682054932017379:nnt19d9btwo');

app.get('/search/:q', function(req, res){
  var q = req.params.q;
  var offset = req.query.offset;
  var base = 'https://www.googleapis.com/customsearch/v1?searchType=image',
      query = 'q=' + q;
  var url = base + '&' + query + '&' + cx + '&' + key;
  if(offset)
    url += ('&start=' + offset);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var results = JSON.parse(body).items;
      var items = [];
      res.json(results.map(function(item){
        return {
          url: item.link,
          snippet: item.snippet,
          thumbnail: item.image.thumbnailLink,
          context: item.image.contextLink
        };
      }));
    }
    else {
      res.json({'error': 'search failed' });
      console.log("Got an error: ", error, ", status code: ", response.statusCode);
    }
  });
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
  console.log("Server listening on port: ", app.get('port'));
});