const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const express = require('express');

const router = express.Router();

router.patch('/updateMe', authController.protect, userController.updateMe);

router.patch(
  '/updateProfilePicture',
  authController.protect,
  userController.uploadUserPhoto, // multer middleware
  userController.resizeUserPhoto, // process/resize image
  userController.updateProfilePicture // update in DB
);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.post(
  '/requestOwner',
  authController.protect,
  userController.requestOwner
);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

// router.route('/').get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers);
router.route('/').get(userController.getAllUsers);

module.exports = router;

// router.post('/logout', userController.logout);

// User Profile & Actions (Protected - requires authentication);
// router.get('/profile', authUser, userController.getUserProfile);

// User's Booking History (Protected)
// router.get('/my-bookings', authUser, userController.getMyBookings);

// User's Reviews (Protected)
// router.get('/my-reviews', authUser, userController.getMyReviews);

// Team Management for the User (Protected)
// router.get('/my-teams', authUser, userController.getMyTeams);
// router.post('/join-team', authUser, userController.joinTeam); // Using an invite code/link

// Loyalty Program (Protected)
// router.get('/loyalty-points', authUser, userController.getLoyaltyPoints);

// Inbox/Messages (Protected)
// router.get('/inbox', authUser, userController.getMyMessages);
// router.post('/inbox/send', authUser, userController.sendMessage);
// router.get('/inbox/:conversationId', authUser, userController.getConversation);
