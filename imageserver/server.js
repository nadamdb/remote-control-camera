"use strict";
// Imports
const http = require("http");
const timestamp = require('time-stamp');
const express = require("express");
const fileUpload = require('express-fileupload');
const axios = require('axios');
const bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;
var db = new sqlite3.Database('./movements.db');
var python_server_ip = "192.168.66.3";
var python_server_port = 5000;
axios.defaults.port = python_server_port;
// Important! Where to move the uploaded file on the server. 
let path = 'public/uploads/';



// Used for ?? (I don't really know)
var URL_this_running_on = ""; //"http://csontho.info:3000";

// Start HTTP server. Listening on PORT 3000, or paramter (PORT=33 node server.js starts server on 33 port)
httpServer.listen(PORT, () => {
  console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] ' + `Server is listening on port ${PORT}`);
});


// Use express-fileupload to upload images
app.use(fileUpload());

// Serving static files, like uploaded images
app.use(express.static('public'));
app.use(express.static(__dirname + '/../website/'));

// Bodyparser
app.use(bodyParser.json());


// /upload site to post images (ex.: curl -X POST http://csontho.info:3000/upload -F sampleFile=@image.png )
app.post('/upload', function (req, res) {
  if (req.files != null) {

    if (Object.keys(req.files).length == 0) {

      return res.status(400).send();

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

    return res.status(400).send(400);


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
    res.send(200);


    console.log('[Image Server][' + timeStamp + '] Image "' + sampleFile.name + '" uploaded to the server. Renamed to "' + imageName + '"');
    db.run('INSERT INTO movements(date_time, path, image, is_new) VALUES(?, ?, ?, ?)', [timeStamp, url, imageName, 1], (err) => {
      if (err) {
        return console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] ' + err.message);
      }
      console.log('[Image Server][' + timeStamp + '] Row was added to the table.');
    })
  });
});

app.get("/stats", function (req, res) {

  var sql = "SELECT COUNT(path) as number FROM movements WHERE is_new=1";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] ' + err);
      res.send('Table is missing.');
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    var answer = "";
    var json_front = '{ "movements": "'
    var json_end = '"}'
    rows.forEach((row) => {
      answer = row.number;
    });
    answer = json_front + answer + json_end;
    res.end(answer);

  });
});

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
      answer = '{"timestamp":"' + row.date_time + '", "url":"' + URL_this_running_on + '/' + tmpImageUrl + '","path":"' + row.path + '","is_new":"' + row.is_new + '"},' + answer;
    });
    answer = answer.substring(0, answer.length - 1);
    answer = json_front + answer + json_end;
    res.end(answer);

  });
  // Reset isNew
  // var sql_reset = "UPDATE movements SET is_new = 0 WHERE is_new = 1";
  // db.all(sql_reset, [], (err, rows) => {
  //   if (err) {
  //     console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] ' + err);
  //     return;
  //   }
  // });

});

app.get("/newmovements", function (req, res) {
  var sql = "SELECT * FROM movements WHERE is_new = 1";

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
      answer = '{"timestamp":"' + row.date_time + '", "url":"' + URL_this_running_on + '/' + tmpImageUrl + '","path":"' + row.path + '","is_new":"' + row.is_new + '"},' + answer;
    });
    answer = answer.substring(0, answer.length - 1);
    answer = json_front + answer + json_end;
    res.end(answer);

  });
  // Reset isNew
  var sql_reset = "UPDATE movements SET is_new = 0 WHERE is_new = 1";
  db.all(sql_reset, [], (err, rows) => {
    if (err) {
      console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] ' + err);
      return;
    }});

});

app.put("/motion", function (req, res) {

  console.log("/ motion arrived = MOTION DETECTED");
  res.status(200).send("It's not good my friend");
  // DO THINGS
});

// Toggle camera on / off
app.post("/camera", function (req, res) {
  // Toggle camere
  console.log(req.body)
  var command = req.body.value
  if (command != "on" && command != "off") {
    console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] wrong request');
    res.status(400).send();
    return;
  }
  postMethod(command).then((result) => {
    console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] Camera turned ' + command);
    console.log(`statusCode: ${result.status}`);
    console.log(result.data);
    res.status(200).send()
  }).catch((error) => {
    console.error(error)
    console.log('[Image Server][' + timestamp.utc('YYYY-MM-DD_HH-mm-ss') + '] error at server');
    res.status(500).send();
  })

});


// GET camera status
app.get("/camera", function (req, res) {
  getMethod("/status").then(function (result) {
    var camera_status = result.data;
    if (camera_status.status == "on") {
      res.send("ON");
    } else if (camera_status.status == "off") {
      res.send("OFF");
    }
    else {
      res.send("unknown");
    }
  }).catch(function (error) {
    // handle error
    console.log(error);
    res.status(500).send();
  })


});


function getMethod(url) {

  return axios({
    method: 'get',
    url: "http://" + python_server_ip + ":" + python_server_port + url
  })
}


function postMethod(command) {
  console.log("Axiospost command:" + command)
  return axios({
    method: 'post',
    url: "http://" + python_server_ip + ":" + python_server_port + "/camera",
    data: {
      value: command
    }
  })
}
module.exports = app;
