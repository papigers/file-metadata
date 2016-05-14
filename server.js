var express = require('express');
var path = require('path');
var multer = require('multer');
var fs = require('fs');

var dirPath = 'uploads/';

function deleteUploads() {
  fs.readdir(dirPath, function (err, files) {
    if (err) {
      console.log(JSON.stringify(err));
    } else {
      files.forEach(function (file) {
        fs.unlink(dirPath + file, function (err) {
          if (err) {
            console.log(JSON.stringify(err));
          }
        });
      })
    }
  });
}

var upload = multer({
  dest: dirPath
});

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.post('/analyse', upload.any(), function (req, res) {
  var file = req.files[0];
  var ret = {
    size: file.size,
    name: file.originalname,
    encoding: file.encoding,
    type: file.mimetype
  }
  res.end(JSON.stringify(ret));
  deleteUploads();
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
  console.log("Server listening on port: ", app.get('port'));
});