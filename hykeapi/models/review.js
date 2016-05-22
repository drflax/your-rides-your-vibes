var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reviewSchema = new Schema({
  created: { type: Date, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  hikeId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('Review', reviewSchema);
