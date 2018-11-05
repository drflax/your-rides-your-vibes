var express = require('express');
var app = express.Router();
var passport = require('passport');

var Hike = require('../models/hike');

// Get all hikes
app.get('/all', function (req, res) {
  Hike.find({}, function (err, hikes) {
    if (err) {
      return res.send(err);
    }
    return res.status(200).send(hikes);
  })
});

// Geospatial lookup
app.get('/geo/', function (req, res, next) {
  var limit = req.query.limit || 10;
  var maxDistance = req.query.distance || 10;
  maxDistance /= 6371;
  var coords = [req.query.lng, req.query.lat];
  Hike.find({
    'location.loc': {
      $nearSphere: coords,
      $maxDistance: maxDistance
    }
  }).limit(limit).exec(function (err, locations) {
    if (err) {
      return res.send(err);
    }
    return res.status(200).send(locations);
  })
})

// Get single hike by ID
app.get('/:id', function (req, res) {
  Hike.findOne({
    _id: req.params.id
  }, function (err, hike) {
    if (err) {
      return res.send(err);
    }
    if (hike === null) {
      return res.status(404).send(['Hike ID ' + req.params.id + ' does not exist.']);
    }
    return res.status(200).send(hike);
  })
});

// Delete a hike
app.delete('/:id', function (req, res) {
  Hike.findOneAndRemove({
    _id: req.params.id
  }, function (err, hike) {
    if (err) {
      return res.send(err);
    }
    if (hike === null) {
      return res.status(404).send(['Hike ID ' + req.params.id + ' does not exist.']);
    }
    Review.remove({
      hike_id: req.params.id
    }, function (err, reviews) {
      if (err) {
        return res.send(err);
      }
    });
    return res.status(200).send(['Hike ID ' + req.params.id + ' and associated reviews deleted.']);
  })
});

// Add a new hike
app.post('/', function (req, res) {
  var hike = new Hike(req.body);
  hike.save(function (err) {
    if (err) {
      var msgs = getErrorMessages(err.errors)
      return res.status(400).send(msgs);
    } else {
      return res.send(hike);
    }
  });
});

// Update existing hike
app.put('/:id', function (req, res) {
  var fields = {};
  // Only update the fields that were sent with the request.
  for (var field in req.body) {
    fields[field] = req.body[field];
  }
  Hike.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: fields
    }, {
      new: true,
      runValidators: true
    },
    function (err, hike) {
      if (err) {
        var msgs = getErrorMessages(err.errors)
        return res.status(400).send(msgs);
      }
      if (hike === null) {
        return res.status(404).send(['Hike ID ' + req.params.id + ' does not exist.']);
      }
      return res.send(hike);
    })
});


module.exports = app;
