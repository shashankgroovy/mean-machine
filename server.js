"use-strict"

// Method 1
// pure nodejs way

var http = require('http'),
    fs = require('fs');

http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin' : '*'
  });

  // grab index.html
  var readStream = fs.createReadStream(__dirname + '/index.html');

  readStream.pipe(res);
}).listen(3000);

console.log('Listening at http://localhost:3000');
