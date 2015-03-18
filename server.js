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

/* router.use() -
 * A route middleware that will execute something before a request is processed.
 */
adminRouter.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

// define the routes
adminRouter.get('/', function(req, res) {
  res.send('dashboard');
});

adminRouter.get('/users', function(req, res) {
  res.send('users page');
});

// add a validation check before GET request is executed
adminRouter.param('name', function(req, res, next, name) {
  console.log('Running validations on', name);
  req.name == name;
  next();
});

adminRouter.get('/users/:name', function(req, res) {
  res.send('hello ' + req.params.name + '!');
});

adminRouter.get('/posts', function(req, res) {
  res.send('posts page');
});

// apply all the routes back to our application
app.use('/admin', adminRouter);

app.listen(3000);
console.log('Listening at http://localhost:3000');
