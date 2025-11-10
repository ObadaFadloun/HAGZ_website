const express = require('express');
const authController = require('../controllers/authController');
const ownerDashboard = require('../controllers/ownerController');

const router = express.Router();

router.get(
  '/dashboard',
  authController.protect,
  authController.restrictTo('owner'),
  ownerDashboard.getOwnerDashboard
);

module.exports = router;
