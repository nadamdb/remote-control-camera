"use strict";
const http = require("http");
const timestamp = require('time-stamp');
const fileUpload = require('express-fileupload');

const express = require("express");
const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./movements.db');
var path_req = require('path');

var URL_this_running_on = "";
httpServer.listen(3000, () => {
  console.log(`Server is listening on port ${PORT}`);
});


// default options
app.use(fileUpload());

// Server /public dir and index.html site for easy upload
app.use(express.static('public'));
app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    
    var status_400_response = "<html><head><title>Upload failed!</title></head><body> Upload failed."+' <a href="'+URL_this_running_on+'/index.html">Take me back to the upload form</a> / <a href="'+URL_this_running_on+'/movements"> Visit /movements site</a>'
    return res.status(400).send(status_400_response);
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  let filename = sampleFile.name;
  let sampleFile_exttension = filename.slice(filename.length-3, filename.length);
  if(sampleFile_exttension === "jpg" || sampleFile_exttension === "png"){
    console.log("File was ok: "+filename);
    }
  else {
    return res.status(400).send('Wrong format.');
  }
  // Use the mv() method to place the file somewhere on your server
  var timeStamp = timestamp.utc('YYYY-MM-DD_HH-mm-ss');
  let path = '/root/agilis/public/uploads/';
  let imageName = 'movement'+timeStamp+'.png'
  let url = path+imageName;
  sampleFile.mv(url, function(err) {
    if (err)
      return res.status(500).send(err);
    var success_response = "<html><head><title>Upload complete!</title></head><body> Upload completed. File: "+imageName + ' uploaded to the server. <a href="'+URL_this_running_on+'/index.html">Take me back to the upload form</a> / <a href="'+URL_this_running_on+'/movements"> Visit /movements site</a>'
    res.send(success_response);
    console.log(imageName);
    db.run('INSERT INTO movements(date_time, path, image) VALUES(?, ?, ?)', [timeStamp, url, imageName], (err) => {
      if(err) {
        return console.log(err.message); 
      }
      console.log('Row was added to the table.');
    })
  });
});

app.get("/movements", function(req, res){
    //res.send('Hello world!');
    var html_begin='<html><head><title>Detected movements</title><link rel="stylesheet" type="text/css" href="styles/styles.css"></head><body><div class="body-div"><table><tr><th>Date & Time of movement</th><th>Image name</th><th>Path in server</th><th>Small size image</th><th></th></tr>';
    var html_end="</table></div></body></html>";
    var sql = "SELECT * FROM movements";

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log(err);
      res.send('Table is missing.');
      return;
      }
      var answer = "";
      rows.forEach((row) => {
        var tmpImageUrl = 'uploads/'+row.image;
        answer = '<tr><td>'+row.date_time+'</td><td>'+row.image+'</td><td>'+row.path+'</td><td><img src="'+tmpImageUrl+'" width="50" /></td><td><a target="_blank" href="'+tmpImageUrl+'" class="button">Open in new tab</a></td></tr>'+answer;
      });
      
      var response = html_begin+answer+html_end;
    res.send(response);
    });
});