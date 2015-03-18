"use-strict"

// Method 1
// expressjs way

var express = require('express'),
    app = express(),
    path = require('path');

app.get('/' ,function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

// using the express Router instance to channel our requests
var adminRouter = express.Router();
adminRouter.get('/', function(req, res) {
  res.send('dashboard');
});

adminRouter.get('/users', function(req, res) {
  res.send('users page');
});

adminRouter.get('/posts', function(req, res) {
  res.send('posts page');
});

// apply all the routes back to our application
app.use('/admin', adminRouter);

app.listen(3000);
console.log('Listening at http://localhost:3000');
