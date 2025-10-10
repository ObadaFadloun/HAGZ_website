const authController = require('../controllers/authController');

const express = require('express');

const router = express.Router();

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

module.exports = router;
