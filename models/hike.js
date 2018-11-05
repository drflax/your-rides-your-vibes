var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var difficulties = 'Easy Moderate Hard'.split(' ');

var features = ['Beach', 'Cave', 'Forest', 'Lake', 'Hot Spring', 'River',
  'Views', 'Waterfall', 'Wildflowers', 'Wildlife'];

var hikeSchema = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  length: { type: Number, required: true, min: 0 },
  elevation: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, maxlength: 1000 },
  features: [{ type: String }],
  difficulty: { type: String, required: true, enum: difficulties },
  location: {
    city: { type: String, required: true },
    district: { type: String, required: true },
    country: { type: String, required: true },
    loc: {
      type: [Number],
      index: '2dsphere',
      required: true
    }
  }
});

hikeSchema.index({ loc: '2dsphere' })

hikeSchema.path('features').validate(function(features) {
  for (var feature of features) {
    if (!feature.match(
      "Beach|Cave|Forest|Lake|Hot spring|River|Views|Waterfall|Wildflowers|Wildlife"
    )) {
      return false;
    }
  }
  return true;
}, 'Invalid feature type: {VALUE}')

module.exports = mongoose.model('Hike', hikeSchema);
