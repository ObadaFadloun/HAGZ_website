const express = require('express');
const {
  createReview,
  getReviewsByField,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.use(protect);

router.post('/', createReview);
router.get('/field/:fieldId', getReviewsByField);
router.delete('/:id', deleteReview);

module.exports = router;
