const Review = require('../models/reviewModel');
const Reservation = require('../models/reservationModel');
const FootballField = require('../models/footballFieldModel');

exports.createReview = async (req, res) => {
  try {
    const { field, rating, text } = req.body;

    // ✅ Ensure the user completed a booking for that field
    const reservation = await Reservation.findOne({
      player: req.user.id,
      field,
      status: 'completed'
    });

    if (!reservation) {
      return res.status(403).json({
        status: 'fail',
        message:
          'You can only review fields you have completed reservations for.'
      });
    }

    // ✅ Create the review
    const review = await Review.create({
      user: req.user.id,
      field,
      rating,
      text
    });

    await review.populate('user', 'firstName lastName');

    // ✅ Recalculate field ratings after review creation
    const stats = await Review.aggregate([
      { $match: { field: review.field } },
      {
        $group: {
          _id: '$field',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await FootballField.findByIdAndUpdate(review.field, {
        averageRating: stats[0].averageRating,
        totalReviews: stats[0].totalReviews
      });
    }

    res.status(201).json({
      status: 'success',
      data: review
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getReviewsByField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const reviews = await Review.find({ field: fieldId });
    res.status(200).json({ status: 'success', data: reviews });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    // ✅ Delete the user's review
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or not yours' });
    }

    // ✅ Recalculate field ratings after deletion
    const stats = await Review.aggregate([
      { $match: { field: review.field } },
      {
        $group: {
          _id: '$field',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    // ✅ Update the football field rating
    if (stats.length > 0) {
      await FootballField.findByIdAndUpdate(review.field, {
        averageRating: stats[0].averageRating,
        totalReviews: stats[0].totalReviews
      });
    } else {
      // If no reviews left, reset ratings
      await FootballField.findByIdAndUpdate(review.field, {
        averageRating: 0,
        totalReviews: 0
      });
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
