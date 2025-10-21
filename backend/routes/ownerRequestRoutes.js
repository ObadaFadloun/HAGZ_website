const express = require('express');
const authController = require('../controllers/authController');
const ownerRequestController = require('../controllers/ownerRequestController');

const router = express.Router();

// Player side
router.post(
  '/become-owner',
  authController.protect,
  authController.restrictTo('player'),
  ownerRequestController.createOwnerRequest
);

// Admin side
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    ownerRequestController.getAllRequests
  );

router.patch(
  '/:id/approve',
  authController.protect,
  authController.restrictTo('admin'),
  ownerRequestController.approveRequest
);

router.patch(
  '/:id/reject',
  authController.protect,
  authController.restrictTo('admin'),
  ownerRequestController.rejectRequest
);

module.exports = router;
