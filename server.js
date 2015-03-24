"use-strict"

var express = require('express');
var app  = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var jwt = require('jsonwebtoken');

var port = process.env.PORT || 8000;
var User = require('./models/user');
var secretToken = 'the-mean-machine'


// use body-parser to grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// Routes API
var apiRouter = express.Router();

apiRouter.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user) {
    if (err) throw err;

    // no user with that username found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      })
    } else if(user) {
      //check if password matches
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        // user found and correct password
        var token = jwt.sign({
          name: user.name,
            username: user.username
        }, secretToken, {
          expiresinMinutes: 1440 // 24 hours
        });
        res.json({
          success: true,
          message: 'Token received',
          token: token
        });
      }
    }
  });
});

apiRouter.use(function(req, res, next) {
  console.log('This is a RESTful api');
  next();
});

apiRouter.get('/', function(req, res) {
  res.json({ message: 'welcome to the api' });
});

apiRouter.route('/users')
  .post(function(req, res) {
    var user = new User();

    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;
    
    user.save(function(err) {
      if (err) {
        if (err.code == 11000)
          return res.json({ success: false, message: 'Username already exists'});
        else
          return res.send(err);
      }
      res.json({message: 'User created!'});
    });
  })
  .get(function(req, res) {
    User.find(function(err, users) {
      if(err) res.send(err);
      res.json(users);
    });
  });

apiRouter.route('/users/:user_id')
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err) res.send(err);
      res.json(user);
    });
  })
  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);
      if (req.body.name) user.name = req.body.name;
      if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;
      
      //save the user
      user.save(function(err) {
        if (err) res.send(err);
        res.json({message: 'User info updated'});
      });
    });
  })
  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err) return res.send(err);
      res.json({ message: 'successfully deleted'});
    });
  });


// Universal routes
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// register our custom router instances back to the application
app.use('/api', apiRouter);

app.listen(port);
console.log('Listening on port ' + port);
