"use-strict"

// Method 1
// expressjs way

var express = require('express'),
    app = express(),
    path = require('path');

app.get('/' ,function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(3000);

console.log('Listening at http://localhost:3000');
