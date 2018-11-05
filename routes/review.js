var express = require('express');
var app = express.Router();
var passport = require('passport');

var Review = require('../models/review');
var User = require('../models/user');
var Hike = require('../models/hike');

// Add a new review
app.post('/', function (req, res, next) {

  var review = new Review(req.body);
  review.created = new Date();

  passport.authenticate('jwt', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid user.' });
    }
    if (user) {
      Hike.findOne({
        _id: req.body.hike_id
      }, function (err, hike) {
        if (err) {
          return res.send(err);
        }
        if (req.body.hike_id && hike === null) {
          return res.status(400).send(['Hike ID ' + req.body.hike_id + ' does not exist.']);
        }
        review.userId = user._id
        review.save(function (err) {
          if (err) {
            var msgs = getErrorMessages(err.errors)
            return res.status(400).send(msgs);
          } else {
            return res.send(review);
          }
        });
      })
    }
  })(req, res, next);
});

// Get all reviews
app.get('/all', function (req, res) {
  Review.find({}, function (err, reviews) {
    if (err) {
      return res.send(err);
    }
    return res.status(200).send(reviews);
  })
});

// Get all reviews for a hike
app.get('/byHike/:hikeId', function (req, res) {
  Hike.findOne({
    _id: req.params.hikeId
  }, function (err, hike) {
    if (err) {
      return res.send(err);
    }
    if (hike === null) {
      return res.status(404).send(['Hike ID ' + req.params.hikeId + ' does not exist.']);
    }
    Review.find({
      hikeId: req.params.hikeId
    }, function (err, reviews) {
      if (err) {
        return res.send(err);
      }
      return res.status(200).send(reviews);
    })
  })
});

// Get all reviews for a user
app.get('/me', function (req, res, next) {
  passport.authenticate('jwt', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid user.' });
    }
    if (user) {
      console.log(user)
      Review.find({
        userId: user._id
      }, function (err, reviews) {
        if (err) {
          return res.send(err);
        }
        return res.status(200).send(reviews);
      })
    }
  })(req, res, next);
});



// Get a single review by ID
app.get('/:id', function (req, res) {
  Review.findOne({
    _id: req.params.id
  }, function (err, review) {
    if (err) {
      return res.send(err);
    }
    if (review === null) {
      return res.status(404).send(['Review ID ' + req.params.id + ' does not exist.']);
    }
    return res.status(200).send(review);
  })
});

// Update existing review
app.put('/:id', function (req, res) {
  var fields = {};
  // Only update the fields that were sent with the request.
  for (var field in req.body) {
    fields[field] = req.body[field];
  }
  Review.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: fields
    }, {
      new: true,
      runValidators: true
    },
    function (err, review) {
      if (err) {
        var msgs = getErrorMessages(err.errors)
        return res.status(400).send(msgs);
      }
      if (req.params.id && review === null) {
        return res.status(404).send(['Review ID ' + req.params.id + ' does not exist.']);
      }
      Hike.findOne({
        _id: req.body.hike_id
      }, function (err, hike) {
        if (err) {
          return res.send(err);
        }
        if (req.body.hike_id && hike === null) {
          return res.status(404).send(['Hike ID ' + req.body.hike_id + ' does not exist.']);
        } else {
          return res.send(review);
        }
      })
    })
});

// Delete a review
app.delete('/:id', function (req, res) {
  Review.findOneAndRemove({
    _id: req.params.id
  }, function (err, review) {
    if (err) {
      return res.send(err);
    }
    if (review === null) {
      return res.status(404).send(['Review ID ' + req.params.id + ' does not exist.']);
    }
    return res.status(200).send(['Review ID ' + req.params.id + ' deleted.']);
  })
});

module.exports = app;
