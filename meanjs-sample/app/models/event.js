'use strict';

var _ = require('lodash');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EventSchema = new Schema({
  ratings: [],
  averageRating: Number
});

EventSchema.methods.getTotalRating = function() {
  var totalRatings = 0;

  _.each(this.ratings, function(item) {
    totalRatings += item.rating;
  });

  return totalRatings;
};

EventSchema.methods.calculateAverageRating = function() {
  var totalRatings = this.getTotalRating();

  if (totalRatings === 0) {
    this.averageRating = 0;
  } else {
    this.averageRating = totalRatings / this.ratings.length;
  }
};

EventSchema.pre('save', function(next) {
  this.calculateAverageRating();
  next();
});

module.exports = mongoose.model('Event', EventSchema);

