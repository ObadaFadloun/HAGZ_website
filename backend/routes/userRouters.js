const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const express = require('express');

const router = express.Router();

// Protect all routes below
router.use(authController.protect);

router.patch('/update-me', userController.updateMe);

router.patch(
  '/update-profile-picture',
  userController.uploadUserPhoto, // multer middleware
  userController.resizeUserPhoto, // process/resize image
  userController.updateProfilePicture // update in DB
);

router.patch('/update-my-password', authController.updatePassword);

router.delete('/delete-me', userController.deleteMe);

router.delete(
  '/:id',
  authController.restrictTo('admin'),
  userController.deleteUser
);

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getAllUsers
);

module.exports = router;

// User Profile & Actions (Protected - requires authentication);
// router.get('/profile', authUser, userController.getUserProfile);

// User's Booking History (Protected)
// router.get('/my-bookings', authUser, userController.getMyBookings);

// User's Reviews (Protected)
// router.get('/my-reviews', authUser, userController.getMyReviews);

// Loyalty Program (Protected)
// router.get('/loyalty-points', authUser, userController.getLoyaltyPoints);

// Inbox/Messages (Protected)
// router.get('/inbox', authUser, userController.getMyMessages);
// router.post('/inbox/send', authUser, userController.sendMessage);
// router.get('/inbox/:conversationId', authUser, userController.getConversation);
