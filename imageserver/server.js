"use strict";
// Imports
const http = require("http");
const timestamp = require('time-stamp');
const express = require("express");
const fileUpload = require('express-fileupload');
var sqlite3 = require('sqlite3').verbose();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;
var db = new sqlite3.Database('./movements.db');

// Important! Where to move the uploaded file on the server. 
let path = 'public/uploads/';


// Answer is JSON or HTLM site. (HTML used for testing)
var legacyHTMLformat = false;
// Used for ?? (I don't really know)
var URL_this_running_on = ""; //"http://csontho.info:3000";

// Start HTTP server. Listening on PORT 3000, or paramter (PORT=33 node server.js starts server on 33 port)
httpServer.listen(PORT, () => {
  console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] ' + `Server is listening on port ${PORT}`);
});


// Use express-fileupload to upload images
app.use(fileUpload());

// Serving static files, like uploaded images
app.use(express.static(__dirname + 'public'));
app.use(express.static(__dirname + '/../website/'));

// /upload site to post images (ex.: curl -X POST http://csontho.info:3000/upload -F sampleFile=@image.png )
app.post('/upload', function (req, res) {
  if (req.files != null) {

    if (Object.keys(req.files).length == 0) {
      if (legacyHTMLformat) {
        var status_400_response = "<html><head><title>Upload failed!</title></head><body> Upload failed." + ' <a href="' + URL_this_running_on + 'index.html">Take me back to the upload form</a> / <a href="' + URL_this_running_on + '/movements"> Visit /movements site</a>'
        return res.status(400).send(status_400_response);
      } else {
        return res.status(400).send();
      }
    }
  } else {
    //console.log("No file uploaded");
    return res.status(400).send();
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  let filename = sampleFile.name;
  // Check if file is jpg or png
  let sampleFile_exttension = filename.slice(filename.length - 3, filename.length);
  if (sampleFile_exttension === "jpg" || sampleFile_exttension === "png") {
    console.log("[Image Server][" + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + "] File format was ok: " + filename);
  }
  else {
    if (legacyHTMLformat) {
      return res.status(400).send('Wrong format.');
    } else {
      return res.status(400).send(400);
    }

  }

  // Timestamp format
  var timeStamp = timestamp.utc('YYYY-MM-DD_HH-mm-ss');
  // Rename image to static format. (Like movement2019-03-26_10-23-33.png);
  let imageName = 'movement' + timeStamp + '.' + sampleFile_exttension;
  let url = path + imageName;
  // Use the mv() method to place the file somewhere on your server. NEeds path variable!
  sampleFile.mv(url, function (err) {
    if (err)
      return res.status(500).send(err);
    var success_response = "<html><head><title>Upload complete!</title></head><body> Upload completed. File: " + imageName + ' uploaded to the server. <a href="' + URL_this_running_on + 'index.html">Take me back to the upload form</a> / <a href="' + URL_this_running_on + '/movements"> Visit /movements site</a>'
    if (legacyHTMLformat) {
      res.send(success_response);
    } else {
      res.send(200);
    }

    console.log('[Image Server][' + timeStamp + '] Image "' + sampleFile.name + '" uploaded to the server. Renamed to "' + imageName + '"');
    db.run('INSERT INTO movements(date_time, path, image) VALUES(?, ?, ?)', [timeStamp, url, imageName], (err) => {
      if (err) {
        return console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] ' + err.message);
      }
      console.log('[Image Server][' + timeStamp + '] Row was added to the table.');
    })
  });
});

if (legacyHTMLformat) {
  app.get("/movements", function (req, res) {
    //res.send('Hello world!');
    var html_begin = '<html><head><title>Detected movements</title><link rel="stylesheet" type="text/css" href="styles/styles.css"></head><body><div class="body-div"><table><tr><th>Date & Time of movement</th><th>Image name</th><th>Path in server</th><th>Small size image</th><th></th></tr>';
    var html_end = "</table></div></body></html>";
    var sql = "SELECT * FROM movements";

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] ' + err);
        res.send('Table is missing.');
        return;
      }
      var answer = "";
      rows.forEach((row) => {
        var tmpImageUrl = 'uploads/' + row.image;
        answer = '<tr><td>' + row.date_time + '</td><td>' + row.image + '</td><td>' + row.path + '</td><td><img src="' + tmpImageUrl + '" width="50" /></td><td><a target="_blank" href="' + tmpImageUrl + '" class="button">Open in new tab</a></td></tr>' + answer;
      });

      var response = html_begin + answer + html_end;
      res.send(response);
    });
  });

}
else {
  app.get("/movements", function (req, res) {
    var sql = "SELECT * FROM movements";

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] ' + err);
        res.send('Table is missing.');
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      var answer = "";
      var json_front = '{ "movements": ['
      var json_end = ']}'
      rows.forEach((row) => {
        var tmpImageUrl = 'uploads/' + row.image;
        answer = '{"timestamp":"' + row.date_time + '", "url":"' + URL_this_running_on + '/' + tmpImageUrl + '","path":"' + row.path + '"},' + answer;
      });
      answer = answer.substring(0, answer.length - 1);
      answer = json_front + answer + json_end;
      res.end(answer);
    });
  });
}


// Toggle camera on / off
app.post("/camera", function (req, res) {
  // Toggle camera
  console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] Camera turned ON / OFF');
  if (toggle_camera() === "ok") {
    res.status(200).send();
  } else {
    res.status(503).send();
  }
});

// GET camera status
app.get("/camera", function (req, res) {
  let status = getrandom();
  if (status == 1) {
    res.send("ON");
  } else {
    res.send("OFF");
  }

});

// Ez fogja meghívni a kamera kezelőt
function toggle_camera() {
  return "ok";
}

// Változzon a lekért adat azért, könnyebb legyen fejleszteni frontendet.
function getrandom() {
  let rnd_time = timestamp.utc('ss');
  let rnd = rnd_time % 2;
  return rnd;
}

module.exports = app;
