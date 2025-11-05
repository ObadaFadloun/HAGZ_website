const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    field: {
      type: mongoose.Schema.ObjectId,
      ref: 'Field',
      required: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    text: {
      type: String,
      trim: true,
      required: [true, 'Review text is required']
    }
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate('user', 'firstName lastName');
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
