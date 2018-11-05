var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var Review = require('./models/review');
var User = require('./models/user');

var hikes = require('./routes/hike');
var users = require('./routes/user');
var reviews = require('./routes/review');

// database configuration
var db = process.env.MONGO_URL || 'mongodb://DrFlax:sambucetti1@ds024548.mlab.com:24548/yryv'
mongoose.connect(db);
mongoose.connection.on('error', function () {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?')
});

// JWT configuration
var options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeader();
options.secretOrKey = '7x0jhxt"9(thpX6'

app.use(passport.initialize());

// server configuration
app.use(require('body-parser')());
app.set('port', process.env.PORT || 24548);

// Route/URL configuration
app.use('/hikes', hikes);
app.use('/users', users);
app.use('/reviews', reviews);

// Configure Passport to use local strategy for initial authentication.
passport.use('local', new LocalStrategy(User.authenticate()));

// Configure Passport to use JWT strategy to look up Users.
passport.use('jwt', new JwtStrategy(options, function (jwt_payload, done) {
  User.findOne({
    _id: jwt_payload.id
  }, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
}))

// extracts relevant messages from default MongoDB validation errors
function getErrorMessages(errors) {
  var msgs = [];
  for (var err in errors) {
    msgs.push(errors[err].message);
  }
  return msgs;
}

app.use(function (err, req, res, next) {
  res.type('text/plain');
  res.status(500);
  res.send(err.stack);
});

app.use(function (req, res, next) {
  res.type('text/plain');
  res.status(404);
  res.send('404 Not pollas');
});


app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.');
});
