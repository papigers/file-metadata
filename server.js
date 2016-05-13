var express = require('express');
var path = require('path');
var validUrl = require('valid-url');
var request = require('request');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongourl = process.env.MONGODB_URI || 'mongodb://localhost:27017/imgsrch';

var app = express();

app.set('mongourl', mongourl);
app.use(express.static(path.join(__dirname, 'public')));

var key = 'key=' + (process.env.API_KEY || 'AIzaSyCZURzPGXALgz9XZnYYthBSFMgvoj85zYM');
var cx = 'cx=' + (process.env.SE_ID || '004233682054932017379:nnt19d9btwo');


var insertToHistory = function(query){
  MongoClient.connect(mongourl, function(err, db){
    if(err){
      console.log("Failed to connect to the database");
      return;
    }
    var col = db.collection('history');
    col.count(function(err, count) {
      if(err){
        db.close();
        console.log("Failed to recieve item count");
        return;
      }
      console.log(count);
      if(count >= 10){
        col.findAndModify(
          {},
          {when: 1},
          { $set: { when: new Date(), query: query } }
        , function(err){
          db.close();
          if(err){
            console.log("Failed to remove old querys", err);
            return;
          }
        });
      }
      else{
        col.insert({ when: new Date(), query: query }, function(err){
          db.close();
          if(err){
            console.log("Failed to insert query");
            return;
          }
        });
      }
    });
  });
};

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
      insertToHistory(q);
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

app.get('/history', function(req, res){
  MongoClient.connect(mongourl, function(err, db){
    if(err){
      console.log("Failed to connect to the database");
      return;
    }
    var col = db.collection('history');
    col.find({}, {sort: {when: 1}}).toArray(function(err, data){
      db.close();
      if(err){
        console.log("Failed to fetch query history");
        return;
      }
      res.json(data.map(function(item){
        return {
          query: item.query,
          when: item.when
        };
      }));
    });
  });
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
  console.log("Server listening on port: ", app.get('port'));
});