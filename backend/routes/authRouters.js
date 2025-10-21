const authController = require('../controllers/authController');

const express = require('express');

const router = express.Router();

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-my-password',
  authController.protect,
  authController.updatePassword
);

module.exports = router;
